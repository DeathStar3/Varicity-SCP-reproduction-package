import {SearchbarController} from './searchbar.controller';
import {Building3D} from '../../view/common/3Delements/building3D';
import {Config, ConfigName, CriticalLevel, MetricSpec} from '../../model/entitiesImplems/config.model';
import {SceneRenderer} from '../../view/sceneRenderer';
import {DetailsController} from './menu/details.controller';
import {ProjectController} from './project-selector.controller';
import {LogsController} from "./logs.controller";
import {ConfigSelectorController} from "./config-selector.controller";
import {ConfigService} from "../../services/config.service";
import {SaveController} from "./save.controller";
import {ProjectService} from "../../services/project.service";
import {MenuController} from "./menu/menu.controller";
import {ProjectConfigMenuController} from "./menu/project-config-menu.controller";
import {SettingsController} from "./menu/settings.controller";

export class UIController {

    public static scene: SceneRenderer;
    public static configsName: ConfigName[];
    public static configFileName: string;
    public static config: Config;

    public static createMenu() {
        MenuController.createMenu();
    }

    public static initSearchbar(): void {
        SearchbarController.initMap();
    }

    public static setBackgroundColorSameAsCanvas(): void {
        SettingsController.setBackgroundColorSameAsCanvas();
    }

    public static addEntry(k: string, v: Building3D): void {
        SearchbarController.addEntry(k, v);
    }

    public static clearMap() {
        SearchbarController.emptyMap();
    }

    public static createProjectSelector(projectsName: string[]): void {
        ProjectController.createProjectSelector(projectsName);
    }

    public static createConfigSelector(configs: ConfigName[], filename: string): void {
        this.configsName = configs;
        ConfigSelectorController.createConfigSelector(configs, filename);
    }

    public static createConfig(config: Config): void {
        this.config = config;
    }

    public static createLogs() {
        LogsController.createLogsDisplay();
    }

    public static createProjectSelectorStayOpen(){
        ProjectConfigMenuController.stayOpen();
    }

    public static displayObjectInfo(obj: Building3D, force: boolean = false): void {
        DetailsController.displayObjectInfo(obj, force);
    }

    public static createSaveSection(): void {
        SaveController.addSaveListeners();
    }

    public static async reloadConfigAndConfigSelector(filename: string) {
        this.configsName = (await ConfigService.loadConfigNames(filename)).data;
        const config = await ConfigService.loadDataFile(filename);

        await UIController.initDefaultConfigValues(filename, config);
        this.createConfig(config);
        this.createConfigSelector(this.configsName, filename);
    }

    public static updateScene(criticalLevel: CriticalLevel) {
        if (this.scene) {
            document.getElementById("loading-frame").style.display = 'inline-block';
            switch (criticalLevel) {
                case CriticalLevel.LOW_IMPACT: // Only change the colour, so simple rerender
                case CriticalLevel.RERENDER_SCENE: // Changed variables important enough to warrant a complete rebuilding of the scene
                    SearchbarController.emptyMap();
                    this.scene = this.scene.rerender(this.config);
                    this.scene.buildScene(false);
                    LogsController.updateLogs(this.scene.entitiesList);
                    break;
                case CriticalLevel.REPARSE_DATA: // Changed variables that modify the parsing method, need to reparse the entire file and rebuild
                    // TODO fix issue when adding a new Entrypoint, the scene is only loading the new entry point class and not all the others, but it works after clicking on the config again
                    ConfigSelectorController.reParse(false);
                    break;
                default:
                    throw new Error("didn't receive the correct result from altering config field: " + criticalLevel);
            }
        } else {
            console.log("not initialized");
        }
    }

    public static async initDefaultConfigValues(projectName: string, config: Config) {
        // set default values for metrics spec if doesn't exist
        const metricsNames = (await ProjectService.getProjectMetrics(projectName)).data;
        console.log("metric names", metricsNames)
        metricsNames.forEach(metric => {
            if (!config.metrics.has(metric)) {
                config.metrics.set(metric, new MetricSpec())
            }
        })

        // TODO set default values for the rest
    }

    public static parseQueryParameters() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const project = urlParams.get('project');
        const clazz = urlParams.get('class');
        if (project) {
            ProjectController.selectProject(project);
            if (clazz) SearchbarController.focusOn(clazz);
        }
    }
}
