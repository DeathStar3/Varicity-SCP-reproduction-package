import { EntitiesList } from "../../model/entitiesList";
import { ProjectService } from "../../services/project.service";
import { EvostreetImplem } from "../../view/evostreet/evostreetImplem";
import { ConfigLoader } from "../parser/configLoader";
import { VPVariantsStrategy } from "../parser/strategies/vp_variants.strategy";
import { ParsingStrategy } from './../parser/strategies/parsing.strategy.interface';
import { UIController } from "./ui.controller";

export class ConfigSelectorController {

    static el: EntitiesList;
    private static previousParser: ParsingStrategy;
    private static filename: string;

    static createConfigSelector(configs: string[], filename: string) {
        let parent = document.getElementById("config_selector");

        this.filename = filename;



        let inputElement = document.getElementById("comp-level") as HTMLInputElement;
        inputElement.value = UIController.config.default_level.toString();

        let filterButton = document.getElementById("filter-button") as HTMLButtonElement;
        filterButton.onclick = () => {
            this.reParse();
        }

        for (let config of configs) {
            let node = document.createElement("option") as HTMLOptionElement;
            node.textContent = config;
            node.value = config;
            parent.appendChild(node);

            // projets en vision evostreet
            node.addEventListener("click", () => {
                this.defineConfig(config);

                parent.childNodes[0].nodeValue = "Config selection: " + config;
                inputElement.value = UIController.config.default_level.toString();

                this.reParse();

                // Uncomment below if want to have the config selector window closing on config selection
                // /* @ts-ignore */
                // for (let child of parent.children) {
                //     child.style.display = "none";
                // }
            });
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

    private static async defineConfig(configName: string) {
        UIController.config = (await ConfigLoader.loadConfigFromName(this.filename, configName)).data
        UIController.configName = configName;
    }
}
