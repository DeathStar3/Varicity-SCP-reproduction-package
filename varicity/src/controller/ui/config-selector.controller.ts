import {EntitiesList} from "../../model/entitiesList";
import {ProjectService} from "../../services/project.service";
import {EvostreetImplem} from "../../view/evostreet/evostreetImplem";
import {ConfigService} from "../../services/config.service";
import {VPVariantsStrategy} from "../parser/strategies/vp_variants.strategy";
import {VPVariantsInheritanceStrategy} from "../parser/strategies/vp_variants_inheritance.strategy"
import {ParsingStrategy} from '../parser/strategies/parsing.strategy.interface';
import {UIController} from "./ui.controller";
import {ConfigName} from "../../model/entitiesImplems/config.model";
import {MenuController} from "./menu/menu.controller";
import {ApiAndBlacklistController} from "./menu/api-and-blacklist.controller";
import {SearchbarController} from "./searchbar.controller";

export class ConfigSelectorController {

    static entitiesList: EntitiesList;
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
        node.selected = (!UIController.config.name);
        node.disabled = true;
        parent.appendChild(node);

        // create all the options from the configs names
        for (let config of configs) {
            let node = document.createElement("option") as HTMLOptionElement;
            node.textContent = config.name;
            node.value = config.filename;
            node.selected = (UIController.config.name === config.name) // TODO problem in case multiple same config names

            if(node.selected){
                UIController.configFileName = config;
            }

            parent.appendChild(node);
        }

        // update the view & config in case of a change
        parent.addEventListener('change', async function (event) {
            const configName = (event.target as HTMLInputElement).value;
            if (configName !== undefined) {
                document.getElementById("submenu").style.display = "none"; // When changing project we close all menus
                document.getElementById("loading-frame").style.display = 'inline-block';
                if (MenuController.selectedTab) {
                    MenuController.changeImage(MenuController.selectedTab);
                    MenuController.selectedTab = undefined;
                }

                UIController.configFileName = UIController.configsName.find(conf => conf.filename === configName);

                console.log("change config to '" + configName + "'");
                await ConfigSelectorController.defineConfig(configName);
                ConfigSelectorController.reParse(true);
            }
        });
    }

    public static reParse(updateCamera: boolean) {
        this.previousParser = new VPVariantsStrategy(); // changes here

        // clear the current city
        if (UIController.scene) {
            UIController.scene.dispose();
        }
        UIController.clearMap();

        // recreate the config menu
        UIController.createConfig(UIController.config);

        // update the city
        ProjectService.fetchVisualizationData(this.filename).then((response) => {
            this.entitiesList = this.previousParser.parse(response.data, UIController.config, this.filename);
            SearchbarController.fillSearchBar(response.data.nodes);

            // set max usage level
            const maxLvl = this.entitiesList.getMaxCompLevel();
            ApiAndBlacklistController.defineMaxLevelUsage(maxLvl);

            UIController.scene = new EvostreetImplem(UIController.config, this.entitiesList.filterCompLevel(+UIController.config.default_level));
            UIController.scene.buildScene(updateCamera);
        })
    }

    private static async defineConfig(configName: string) {
        UIController.config = await ConfigService.loadConfigFromName(this.filename, configName);
        await UIController.initDefaultConfigValues(this.filename, UIController.config);
    }
}
