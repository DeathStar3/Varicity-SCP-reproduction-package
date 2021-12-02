import {EntitiesList} from "../../model/entitiesList";
import {ProjectService} from "../../services/project.service";
import {EvostreetImplem} from "../../view/evostreet/evostreetImplem";
import {ConfigService} from "../../services/config.service";
import {VPVariantsStrategy} from "../parser/strategies/vp_variants.strategy";
import {ParsingStrategy} from '../parser/strategies/parsing.strategy.interface';
import {UIController} from "./ui.controller";
import {ConfigName} from "../../model/entitiesImplems/config.model";

export class ConfigSelectorController {

    static el: EntitiesList;
    private static previousParser: ParsingStrategy;
    private static filename: string;

    static createConfigSelector(configs: ConfigName[], filename: string) {
        let parent = document.getElementById("config_selector");
        this.filename = filename;

        // clear all the options in the list
        parent.innerHTML = '';

        // create the default option
        let node = document.createElement("option") as HTMLOptionElement;
        node.textContent = " ---Select a Config --- ";
        node.value = "";
        parent.appendChild(node);

        // create all the options from the configs names
        for (let config of configs) {
            let node = document.createElement("option") as HTMLOptionElement;
            node.textContent = config.name;
            node.value = config.filename;
            node.selected = (UIController.config.name == config.name) // TODO problem in case multiple same config names
            parent.appendChild(node);
        }

        // update the view & config in case of a change
        parent.addEventListener('change', async function(event) {
            const configName = (event.target as HTMLInputElement).value;
            if(configName !== undefined){
                await ConfigSelectorController.defineConfig(configName);
                ConfigSelectorController.reParse();
            }
        });
    }

    public static reParse() {
        this.previousParser = new VPVariantsStrategy();

        // clear the current city
        if (UIController.scene) {
            UIController.scene.dispose();
        }
        UIController.clearMap();

        // recreate the config menu
        UIController.createConfig(UIController.config);

        // update the city
        ProjectService.fetchVisualizationData(this.filename).then((response) => {
            this.el = this.previousParser.parse(response.data, UIController.config, this.filename);

            // set the min & max usage level
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
        UIController.config = await ConfigService.loadConfigFromName(this.filename, configName);
        await UIController.initDefaultConfigValues(this.filename, UIController.config);
    }
}
