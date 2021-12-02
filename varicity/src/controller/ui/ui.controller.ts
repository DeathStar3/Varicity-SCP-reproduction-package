import {SearchbarController} from './searchbar.controller';
import {Building3D} from '../../view/common/3Delements/building3D';
import {Color} from '../../model/entities/config.interface';
import {Config, ConfigName, CriticalLevel, MetricSpec} from '../../model/entitiesImplems/config.model';
import {SceneRenderer} from '../../view/sceneRenderer';
import {ConfigController} from './config.controller';
import {DetailsController} from './details.controller';
import {ProjectController} from './project-selector.controller';
import {LogsController} from "./logs.controller";
import {DocController} from "./doc.controller";
import {ConfigSelectorController} from "./config-selector.controller";
import {ConfigLoader} from "../parser/configLoader";
import {SaveController} from "./save.controller";
import {ProjectService} from "../../services/project.service";
import {MenuController} from "./menu.controller";

export class UIController {

    public static scene: SceneRenderer;
    public static configsName: ConfigName[];
    public static config: Config;
    public static configName: string;

    public static createHeader(): void {

    }

    public static createDoc(): void {
        DocController.buildDoc();
    }

    public static createMenu() {
        MenuController.createMenu();
    }

    public static initSearchbar(): void {
        SearchbarController.initMap();
    }

    public static addEntry(k: string, v: Building3D): void {
        SearchbarController.addEntry(k, v);
    }

    public static clearMap() {
        SearchbarController.emptyMap();
    }

    public static createProjectSelector(keys: string[]): void {
        ProjectController.createProjectSelector(keys);
    }

    public static createConfigSelector(configs: ConfigName[], filename: string): void {
        this.configsName = configs;
        ConfigSelectorController.createConfigSelector(configs, filename);
    }

    public static createConfig(config: Config): void {
        this.config = config;
        ConfigController.createConfigFolder(config);
    }

    public static createLogs() {
        LogsController.createLogsDisplay();
    }

    public static displayObjectInfo(obj: Building3D, force: boolean = false): void {
        DetailsController.displayObjectInfo(obj, force);
    }

    public static createSaveSection(): void {
        SaveController.addSaveListeners();
    }

    public static createFooter(): void {

    }


    public static async reloadConfigAndConfigSelector(filename: string) {
        console.log("filename", filename)
        this.configsName = (await ConfigLoader.loadConfigNames(filename)).data;
        this.configName = this.configsName[0].filename;

        const config = await ConfigLoader.loadConfigFromName(filename, this.configName);

        await UIController.initDefaultConfigValues(filename, config);
        this.createConfig(config);
        this.createConfigSelector(this.configsName, filename);
    }

    public static changeConfig(arr: string[], value: [string, string] | Color) {
        let critical: CriticalLevel = Config.alterField(this.config, arr, value);
        console.log(this.config);
        if (this.scene) {
            SearchbarController.emptyMap();
            switch (critical) {
                case CriticalLevel.LOW_IMPACT: // Only change the colour, so simple rerender
                case CriticalLevel.RERENDER_SCENE: // Changed variables important enough to warrant a complete rebuilding of the scene
                    this.scene = this.scene.rerender(this.config);
                    this.scene.buildScene();
                    LogsController.updateLogs(this.scene.entitiesList);
                    break;
                case CriticalLevel.REPARSE_DATA: // Changed variables that modify the parsing method, need to reparse the entire file and rebuild
                    // TODO fix issue when adding a new Entrypoint, the scene is only loading the new entry point class and not all the others, but it works after clicking on the config again
                    // ProjectController.reParse();
                    ConfigSelectorController.reParse();
                    break;
                default:
                    throw new Error("didn't receive the correct result from altering config field: " + critical);
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
            if(!config.metrics.has(metric)){
                config.metrics.set(metric, new MetricSpec())
            }
        })

        // TODO set default values for the rest
    }
}
