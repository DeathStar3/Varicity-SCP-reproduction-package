import { Config, Vector3_Local } from "../../model/entitiesImplems/config.model";
import { EntitiesList } from "../../model/entitiesList";
import { ProjectService } from "../../services/project.service";
import { EvostreetImplem } from "../../view/evostreet/evostreetImplem";
import { VPVariantsStrategy } from "../parser/strategies/vp_variants.strategy";
import { ParsingStrategy } from './../parser/strategies/parsing.strategy.interface';
import { UIController } from "./ui.controller";

export class ConfigSelectorController {

    static el: EntitiesList;
    private static previousParser: ParsingStrategy;
    private static filename: string;

    static createConfigSelector(configs: Config[], filename: string) {
        let parent = document.getElementById("config_selector");

        this.filename = filename;
        if (configs.length > 0) {
            UIController.config = configs[0];
        }

        parent.innerHTML = "Config selection: " + ((UIController.config !== undefined) ? UIController.config.name : "[no config found]");

        let saveConfigButton = document.getElementById("save-config");
        saveConfigButton.onclick = () => {
            console.log("yaml config: TODO")
            // const doc = new Document();
            // doc.contents = JSON.stringify(UIController.config);
            // console.log(doc.toString());
        }


        let saveCameraButton = document.getElementById("save-btn");
        saveCameraButton.onclick = () => {
            let cameraPos = UIController.scene.camera.getTarget();
            UIController.config.camera_data.target = Vector3_Local.fromVector3(cameraPos);
            UIController.config.camera_data.alpha = UIController.scene.camera["alpha"];
            UIController.config.camera_data.beta = UIController.scene.camera["beta"];
            UIController.config.camera_data.radius = UIController.scene.camera["radius"];
            UIController.createConfig(UIController.config);
        }

        let inputElement = document.getElementById("comp-level") as HTMLInputElement;
        inputElement.value = UIController.config.default_level.toString();

        let filterButton = document.getElementById("filter-button") as HTMLButtonElement;
        filterButton.onclick = () => {
            this.reParse();
        }

        for (let config of configs) {
            let node = document.createElement("div");
            node.innerHTML = " - " + config.name;
            parent.appendChild(node);

            // projets en vision evostreet
            node.addEventListener("click", () => {
                UIController.config = config;

                parent.childNodes[0].nodeValue = "Config selection: " + config.name;
                inputElement.value = UIController.config.default_level.toString();

                this.reParse();

                // Uncomment below if want to have the config selector window closing on config selection
                // /* @ts-ignore */
                // for (let child of parent.children) {
                //     child.style.display = "none";
                // }
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
        this.previousParser = new VPVariantsStrategy();

        if (UIController.scene) {
            UIController.scene.dispose();
        }

        UIController.clearMap();
        UIController.createConfig(UIController.config);

        ProjectService.fetchVisualizationData(this.filename).then(response => {
            this.el = this.previousParser.parse(response.data, UIController.config, this.filename);
            let inputElement = document.getElementById("comp-level") as HTMLInputElement;
            inputElement.min = "1";
            const maxLvl = this.el.getMaxCompLevel();
            inputElement.max = maxLvl.toString();
            if (+inputElement.value > maxLvl) {
                inputElement.value = maxLvl.toString();
            }

            UIController.scene = new EvostreetImplem(UIController.config, this.el.filterCompLevel(+inputElement.value));
            UIController.scene.buildScene();

        })

    }
}
