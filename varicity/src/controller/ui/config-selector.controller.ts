import {EntitiesList} from "../../model/entitiesList";
import {ProjectService} from "../../services/project.service";
import {EvostreetImplem} from "../../view/evostreet/evostreetImplem";
import {ConfigService} from "../../services/config.service";
import {VPVariantsStrategy} from "../parser/strategies/vp_variants.strategy";
import {ParsingStrategy} from '../parser/strategies/parsing.strategy.interface';
import {UIController} from "./ui.controller";
import {ConfigName} from "../../model/entitiesImplems/config.model";
import {MetricController} from "./menu/metric.controller";

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
        UIController.configFileName = (configs[configs.length-1]).filename;

        // update the view & config in case of a change
        parent.addEventListener('change', async function (event) {
            const configName = (event.target as HTMLInputElement).value;
            if (configName !== undefined) {
                UIController.configFileName = configName;
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
        document.getElementById("loading-frame").style.display = 'inline-block';
        ProjectService.fetchVisualizationData(this.filename).then((response) => {
            this.el = this.previousParser.parse(response.data, UIController.config, this.filename);

            // set max usage level
            const maxLvl = this.el.getMaxCompLevel();
            MetricController.defineMaxLevelUsage(maxLvl);

            UIController.scene = new EvostreetImplem(UIController.config, this.el.filterCompLevel(+UIController.config.default_level));
            UIController.scene.buildScene();
        })
    }

    private static async defineConfig(configName: string) {
        UIController.config = await ConfigService.loadConfigFromName(this.filename, configName);
        await UIController.initDefaultConfigValues(this.filename, UIController.config);
    }
}
