import {ParsingStrategy} from './../parser/strategies/parsing.strategy.interface';
import {EvostreetImplem} from "../../view/evostreet/evostreetImplem";
import {UIController} from "./ui.controller";
import {EntitiesList} from "../../model/entitiesList";
import {FilesLoader} from "../parser/filesLoader";
import {VPVariantsStrategy} from "../parser/strategies/vp_variants.strategy";
import {Config} from "../../model/entitiesImplems/config.model";

export class ConfigSelectorController {

    static el: EntitiesList;
    private static previousParser: ParsingStrategy;
    private static config: Config;
    private static filename: string;

    static createConfigSelector(configs: Config[], filename: string) {
        let parent = document.getElementById("config_selector");

        this.filename = filename;
        if(configs.length > 0){
            this.config = configs[0];
        }

        parent.innerHTML = "Config selection: " + ((this.config !== undefined)? this.config.name : "[no config found]");


        let inputElement = document.getElementById("comp-level") as HTMLInputElement;
        inputElement.value = this.config.default_level.toString();

        let filterButton = document.getElementById("filter-button") as HTMLButtonElement;
        filterButton.onclick = () => {
            this.reParse();
        }

        for (let i = 0; i < configs.length; i++) {
            let node = document.createElement("div");
            node.innerHTML =  " - " + configs[i].name;
            parent.appendChild(node);

            // projets en vision evostreet
            node.addEventListener("click", () => {
                this.config = configs[i];

                parent.childNodes[0].nodeValue = "Config selection: " + configs[i].name;
                inputElement.value = this.config.default_level.toString();

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
        UIController.createConfig(this.config);

        this.el = this.previousParser.parse(FilesLoader.loadDataFile(this.filename), this.config, this.filename);
        let inputElement = document.getElementById("comp-level") as HTMLInputElement;
        inputElement.min = "1";
        const maxLvl = this.el.getMaxCompLevel();
        inputElement.max = maxLvl.toString();
        if (+inputElement.value > maxLvl) {
            inputElement.value = maxLvl.toString();
        }

        UIController.scene = new EvostreetImplem(this.config, this.el.filterCompLevel(+inputElement.value));
        UIController.scene.buildScene();
    }
}
