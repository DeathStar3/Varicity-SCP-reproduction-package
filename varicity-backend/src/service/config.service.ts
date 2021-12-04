import * as fs from 'fs';
import {CameraData, ConfigName, VaricityConfig} from "../model/config.model";
import {Vector3} from "../model/user.model";
import {AppModule} from "../app.module";

const path = require('path');
const yaml = require('js-yaml');
const YAML = require('yaml');

export class ConfigService {

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
        const configsPaths = this.getConfigsPathsWithDefaultConfigsFallback(projectName);
        return this.getConfigsFromPath(configsPaths[configsPaths.length - 1]);
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
        const configsPaths = this.getConfigsPathsWithDefaultConfigsFallback(projectName);
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

        const version = this.getConfigsPaths(config.projectId).length + 1; // TODO improve versionning system
        const filename = "config-" + config.projectId + "-" + version;
        fs.writeFile(path.join(pathDirToConfig, filename + ".yaml"),  doc.toString(), err => {
            if (err) {
                console.error(err)
                return;
            }
            //file written successfully
        })

        return {config, filename:  filename};
    }

    /**
     * Get the path of all the default configs
     * @private
     */
    private getDefaultConfigPaths(): string[] {
        if(AppModule.DB.exists('/config/' + ConfigService.defaultConfigsDirectory)){
            return AppModule.DB.getData('/config/' + ConfigService.defaultConfigsDirectory);
        }
        return [];
    }

    /**
     * Get the path of all the configs for a specified project
     * @param projectName
     * @private
     */
    private getConfigsPaths(projectName: string): string[] {
        if(AppModule.DB.exists('/config/' + projectName)){
            return AppModule.DB.getData('/config/' + projectName);
        }
        return []
    }

    /**
     * Get the path of all the configs for a specified project
     * @param projectName
     * @private
     */
    private getConfigsPathsWithDefaultConfigsFallback(projectName: string): string[] {
        if(AppModule.DB.exists('/config/' + projectName)){
            return AppModule.DB.getData('/config/' + projectName);
        }else{
            return this.getDefaultConfigPaths();
        }
    }

    /**
     * Get the file name of all the configs for a specified project
     * @param projectName
     * @private
     */
    public getConfigsFilesNames(projectName: string): string[] {
        const configsPaths = this.getConfigsPathsWithDefaultConfigsFallback(projectName);
        let configsNames = []
        configsPaths.forEach(configPath => {
            configsNames.push(ConfigService.getFileNameOnly(configPath));
        })
        return configsNames;
    }

    /**
     * Gives the name of the configuration set by the user
     * @param projectName ex: junit-r4.12
     * @param configName ex config-junit-r4.12-14 (without extension)
     */
    public getConfigNameFromFileName(projectName: string, configName: string): string {
        const config = this.getConfigByNameFromProject(projectName, configName);
        return config.name || "-blank-";
    }

    /**
     * Gives for all the configs of a project the config name and its filename
     * @param projectName
     */
    public getConfigsNamesAndFileNames(projectName: string): ConfigName[] {
        const configsPaths = this.getConfigsPathsWithDefaultConfigsFallback(projectName);
        let configsNames = []
        configsPaths.forEach(configPath => {
            const fileName = ConfigService.getFileNameOnly(configPath);
            const name = this.getConfigNameFromFileName(projectName, fileName);
            configsNames.push(new ConfigName(name, fileName));
        })
        return configsNames;
    }

    /**
     * Get the Varicity config with the config name and it's project name
     * @param projectName equivalent to the config/projectName/... on disk
     * @param configName without the extension
     */
    public getConfigByNameFromProject(projectName: string, configName: string): VaricityConfig {
        const configsPaths = this.getConfigsPathsWithDefaultConfigsFallback(projectName);
        for (const configPath of configsPaths) {
            if(ConfigService.getFileNameOnly(configPath) === configName){
                return this.getConfigsFromPath(configPath);
            }
        }
        return this.loadDefaultConfig();
    }

    /**
     * return the file name without the yaml or yml extension from any path given
     * @param filePath ex: config/my-file.yaml
     */
    public static getFileNameOnly(filePath: string): string {
        return filePath.split('/').pop().split(/\.y?aml/g).shift();
    }

    private static getProjectNameFromConfigPath(configPath: string) {
        return configPath.split('/')[0];
    }

    public updateConfig(configFile: string, config: VaricityConfig) {
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

        fs.writeFile(path.join(pathDirToConfig, configFile + ".yaml"),  doc.toString(), err => {
            if (err) {
                console.error(err)
                return;
            }
            //file written successfully
        })

        return {config, filename:  configFile};
    }
}
