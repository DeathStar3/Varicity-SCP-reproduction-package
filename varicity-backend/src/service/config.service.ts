import * as fs from 'fs';
import {CameraData, VaricityConfig} from "../model/config.model";
import {Vector3} from "../model/user.model";
import {UtilsService} from "./utils.service";
import {Config} from "node-json-db/dist/lib/JsonDBConfig";
import {JsonDB} from "node-json-db";

const path = require('path');
const yaml = require('js-yaml');
const YAML = require('yaml');

export class ConfigService {

    db = new JsonDB(new Config("index-db", true, true, '/'));

    private static defaultConfigsPath = "./config/";
    private static defaultConfigsDirectory = "default";

    /**
     * Load the first default config that it finds on disk
     */
    public loadDefaultConfig(): VaricityConfig {
        try {
            const defaultConfigs = this.getDefaultConfigPaths();
            return this.getConfigsFromPath(defaultConfigs[0]);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Load the first config of the projectName specified,
     * if not found load the first default config
     * @param projectName
     */
    public getFirstProjectConfigOrDefaultOne(projectName: string): VaricityConfig {
        const configsPaths = this.getConfigsPaths(projectName);
        return this.getConfigsFromPath(configsPaths[0]);
    }

    /**
     * Load the YAML file from the disk to JS object
     * @param pathToYamlOnDisk
     * @private
     */
    private static getYamlFromDisk(pathToYamlOnDisk: string): any{
        console.log("pathToYamlOnDisk", pathToYamlOnDisk)
        return yaml.load(fs.readFileSync(path.join(process.cwd(), ConfigService.defaultConfigsPath, pathToYamlOnDisk), 'utf8'));
    }

    /**
     * Load all the Varicity configs of the specified project
     * @param projectName
     */
    public getConfigsFromProjectName(projectName: string): VaricityConfig[]{
        const configsPaths = this.getConfigsPaths(projectName);
        console.log("configsPaths", configsPaths)
        let configs = [];
        configsPaths.forEach(configPath => {
                configs.push(this.getConfigsFromPath(configPath));
        })

        return configs;
    }

    /**
     * Load a Varicity Config from the yaml file specified on disk
     * @param configPath path to the config .yaml file on the disk
     */
    public getConfigsFromPath(configPath: string): VaricityConfig {
        const config = ConfigService.getYamlFromDisk(configPath) as VaricityConfig;
        if(config.camera_data === undefined){
            config.camera_data = new CameraData(2 * Math.PI / 3, Math.PI / 3, 100, new Vector3());
        }
        config.fileName = ConfigService.getFileNameOnly(configPath);
        config.filePath = configPath;
        // config.projectId = ConfigService.getProjectNameFromConfigPath(configPath);
        return config;
    }

    /**
     * Save a config for a specific project on the disk
     * @param config to save
     */
    public saveConfig(config: VaricityConfig) {
        if (!config.projectId) {
            console.warn('projectId of config is not defined');
            return config;
        }

        // Saves file in filesystem
        const doc = new YAML.Document();
        doc.contents = config;

        let pathDirToConfig = path.join(ConfigService.defaultConfigsPath, config.projectId);

        if (!fs.existsSync(pathDirToConfig)){
            fs.mkdirSync(pathDirToConfig);
        }

        const version = this.getConfigsPaths(config.projectId).length;

        fs.writeFile(path.join(pathDirToConfig, "config-" + config.projectId + "-" + version + ".yaml"),  doc.toString(), err => {
            if (err) {
                console.error(err)
                return
            }
            //file written successfully
        })

        return config;    
    }

    /**
     * Get the path of all the default configs
     * @private
     */
    private getDefaultConfigPaths(): string[] {
        if(this.db.exists('/config/' + ConfigService.defaultConfigsDirectory)){
            console.log("default exist")
            return this.db.getData('/config/' + ConfigService.defaultConfigsDirectory);
        }

        console.log("default not exist" + '/config/' + ConfigService.defaultConfigsDirectory )
        return [];
    }

    /**
     * Get the path of all the configs for a specified project
     * @param projectName
     * @private
     */
    private getConfigsPaths(projectName: string): string[] {
        if(this.db.exists('/config/' + projectName)){
            console.log("this.db.exists('/config/'" + projectName)
            return this.db.getData('/config/' + projectName);
        }else{
            const test = this.getDefaultConfigPaths();
            console.log("test", test);
            return test;
        }
    }


    public getConfigByNameFromProject(projectName: string, configName: string): VaricityConfig {
        const configsPaths = this.getConfigsPaths(projectName);
        configsPaths.forEach(configPath => {
            if(ConfigService.getFileNameOnly(configPath) === configName){
                return this.getConfigsFromPath(configPath);
            }
        })
        console.warn("Config: " + configName + " not found, sending default config");
        return this.loadDefaultConfig();
    }

    public static getFileNameOnly(filePath: string): string {
        return filePath.split('/').pop().split(/\.y?aml/g).shift();
    }

    private static getProjectNameFromConfigPath(configPath: string) {
        return configPath.split('/')[0];
    }
}
