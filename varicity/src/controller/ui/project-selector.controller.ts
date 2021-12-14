import {CurrentProjectListener} from "../../configsaver/listener/current-project-listener";
import {EntitiesList} from "../../model/entitiesList";
import {ProjectService} from "../../services/project.service";
import {EvostreetImplem} from "../../view/evostreet/evostreetImplem";
import {ConfigService} from "../../services/config.service";
import {ParsingStrategy} from '../parser/strategies/parsing.strategy.interface';
import {VPVariantsStrategy} from "../parser/strategies/vp_variants.strategy";
import {UIController} from "./ui.controller";
import {MenuController} from "./menu/menu.controller";
import {ApiAndBlacklistController} from "./menu/api-and-blacklist.controller";
import {SearchbarController} from "./searchbar.controller";

export class ProjectController {
    static el: EntitiesList;
    private static previousParser: ParsingStrategy;
    private static projectListener: CurrentProjectListener = new CurrentProjectListener();
    private static nodes: { [key: string]: HTMLOptionElement } = {}; // TODO INTEGRATION: had to replace to Option instead of Div

    static createProjectSelector(projectsName: string[]) {
        let parent = document.getElementById("project_selector");

        for (let projectName of projectsName) {
            let node = document.createElement("option") as HTMLOptionElement;
            node.value = projectName;
            node.text = projectName;

            ProjectController.nodes[projectName] = node;
            parent.appendChild(node);
        }

        parent.addEventListener('change', function (event) {
            const projectName = (event.target as HTMLInputElement).value;
            if (projectName !== undefined) {
                ProjectController.loadProject(projectName);
                parent.childNodes[0].nodeValue = "Project selection: " + projectName;
            }
        });
    }

    public static loadProject(projectName: string) {

        document.getElementById("submenu").style.display = "none"; // When changing project we close all menus
        if (MenuController.selectedTab) {
            MenuController.changeImage(MenuController.selectedTab);
            MenuController.selectedTab = undefined;
        }

        this.previousParser = new VPVariantsStrategy();

        // clear the current view
        if (UIController.scene) {
            UIController.scene.dispose();
        }
        UIController.clearMap();

        const run = async () => {
            document.getElementById("loading-frame").style.display = 'inline-block';
            await UIController.reloadConfigAndConfigSelector(projectName);

            // TODO find alternative
            await ProjectService.fetchVisualizationData(projectName).then(async (response) => {
                const config = await ConfigService.loadDataFile(projectName);
                this.el = this.previousParser.parse(response.data, config, projectName);
                SearchbarController.fillSearchBar(response.data.nodes);

                // set the min & max usage level
                const maxLvl = this.el.getMaxCompLevel();
                ApiAndBlacklistController.defineMaxLevelUsage(maxLvl);

                UIController.scene = new EvostreetImplem(config, this.el.filterCompLevel(config.default_level));
                UIController.scene.buildScene(true);
            })

            this.projectListener.projectChange(projectName);
        }
        run().then();
    }
}
