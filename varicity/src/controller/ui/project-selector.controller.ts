import { CurrentProjectListener } from "../../configsaver/listener/current-project-listener";
import { EntitiesList } from "../../model/entitiesList";
import { ProjectService } from "../../services/project.service";
import { EvostreetImplem } from "../../view/evostreet/evostreetImplem";
import { ConfigLoader } from "../parser/configLoader";
import { VPVariantsStrategy } from "../parser/strategies/vp_variants.strategy";
import { ParsingStrategy } from '../parser/strategies/parsing.strategy.interface';
import { UIController } from "./ui.controller";
import {fsWatcherService} from "../../../../varicity-backend/src/service/fs-watcher.service";

export class ProjectController {

    static el: EntitiesList;
    private static previousParser: ParsingStrategy;
    private static filename: string;

    private static projectListener:CurrentProjectListener=new CurrentProjectListener();

    static createProjectSelector(keys: string[]) {
        let parent = document.getElementById("project_selector");
        parent.innerHTML = "Project selection";

        for (let key of keys) {
            let node = document.createElement("div");
            node.innerHTML = " - " + key;
            parent.appendChild(node);

            // projets en vision evostreet
            node.addEventListener("click", () => {
                this.previousParser = new VPVariantsStrategy();
                this.filename = key;
                this.reParse();

                const run = async () => {

                    await UIController.reloadConfigAndConfigSelector(this.filename);

                    // TODO find alternative
                    ProjectService.fetchVisualizationData(this.filename).then(async response=>{
                        const config = (await ConfigLoader.loadDataFile(this.filename)).data
                        console.log("config", config)
                        this.el = this.previousParser.parse(response.data, config, this.filename);
                        let inputElement = document.getElementById("comp-level") as HTMLInputElement;
                        UIController.scene = new EvostreetImplem(config, this.el.filterCompLevel(+inputElement.value));
                        UIController.scene.buildScene();
                    })

                    this.projectListener.projectChange(key);
                }
                run().then();

                // this.projectListener.projectChange(key);

                parent.childNodes[0].nodeValue = "Project selection: " + key;

                /* @ts-ignore */
                for (let child of parent.children) {
                    child.style.display = "none";
                }
            });
        }
        /* @ts-ignore */
        for (let child of parent.children) {
            child.style.display = "none";
        }
        parent.onclick = (me) => {
            if (me.target == parent) {
                /* @ts-ignore */
                for (let child of parent.children) {
                    if (child.style.display == "block") child.style.display = "none";
                    else child.style.display = "block";
                }
            }
        }
    }

    public static reParse() {
        if (UIController.scene) {
            UIController.scene.dispose();
        }

        UIController.clearMap();
        // const run = async () => {
        //
        //     await UIController.reloadConfigAndConfigSelector(this.filename);
        //
        // }
        //
        // ProjectService.fetchVisualizationData(this.filename).then(async response=>{
        //     const config = (await ConfigLoader.loadDataFile(this.filename)).data
        //     console.log("config", config)
        //     this.el = this.previousParser.parse(response.data, config, this.filename);
        //     let inputElement = document.getElementById("comp-level") as HTMLInputElement;
        //     UIController.scene = new EvostreetImplem(config, this.el.filterCompLevel(+inputElement.value));
        //     UIController.scene.buildScene();
        // })
    }
}
