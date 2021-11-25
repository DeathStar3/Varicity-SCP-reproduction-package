import { CurrentProjectListener } from "../../configsaver/listener/current-project-listener";
import { EntitiesList } from "../../model/entitiesList";
import { ProjectService } from "../../services/project.service";
import { EvostreetImplem } from "../../view/evostreet/evostreetImplem";
import { ConfigLoader } from "../parser/configLoader";
import { VPVariantsStrategy } from "../parser/strategies/vp_variants.strategy";
import { ParsingStrategy } from './../parser/strategies/parsing.strategy.interface';
import { UIController } from "./ui.controller";



export class ProjectController {

    static el: EntitiesList;
    private static previousParser: ParsingStrategy;
    private static filename: string;

    private static projectListener:CurrentProjectListener=new CurrentProjectListener();

    static createProjectSelector(keys: string[]) {
        let parent = document.getElementById("project_selector");
        parent.innerHTML = "Project selection";
        //
        // let inputElement = document.getElementById("comp-level") as HTMLInputElement;
        // inputElement.value = UIController.config.default_level.toString();
        //
        // let filterButton = document.getElementById("filter-button") as HTMLButtonElement;
        // filterButton.onclick = () => {
        //     ProjectController.reParse();
        // }

        for (let key of keys) {
            let node = document.createElement("div");
            node.innerHTML = " - " + key;
            parent.appendChild(node);

            // projets en vision evostreet
            node.addEventListener("click", () => {
                this.projectListener.projectChange(key);
                this.previousParser = new VPVariantsStrategy();
                this.filename = key;

                this.reParse();

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
        UIController.reloadConfigAndConfigSelector(this.filename);
        
        ProjectService.fetchVisualizationData(this.filename).then(async response=>{
            this.el = this.previousParser.parse(response.data, (await ConfigLoader.loadDataFile(this.filename)).data, this.filename);
            let inputElement = document.getElementById("comp-level") as HTMLInputElement;
            UIController.scene = new EvostreetImplem((await ConfigLoader.loadDataFile(this.filename)).data, this.el.filterCompLevel(+inputElement.value));
            UIController.scene.buildScene();
        })

       
    }
}
