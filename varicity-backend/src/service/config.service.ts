import * as fs from 'fs';
import { CameraData, VaricityConfig } from "../model/config.model";
import { Vector3 } from "../model/user.model";
import { AppModule } from "../app.module";
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { ConfigEntry } from 'src/model/experiment.model';

const path = require('path');
const yaml = require('js-yaml');
const YAML = require('yaml');

export class VaricityConfigService {



    private readonly db: JsonDB;
    private readonly databasePath;
    private readonly pathToDefaultConfigs;

    private readonly pathToVisualizationConfigs;


    constructor(@Inject(ConfigService) private configService: ConfigService) {

        this.databasePath = this.configService.get<string>('DATABASE_PATH');
        this.pathToVisualizationConfigs = this.configService.get<string>('VISUALISATION_CONFIGS_PATH');
        
        this.pathToDefaultConfigs = this.configService.get<string>('DEFAULT_CONFIGS_DIR');

        this.db = new JsonDB(new Config(this.databasePath, true, true, '/'));

    }


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
    private static getYamlFromDisk(pathToYamlOnDisk: string): any {
        console.log("pathToYamlOnDisk", pathToYamlOnDisk)
        return yaml.load(fs.readFileSync(pathToYamlOnDisk, 'utf8'));
    }

    /**
     * Load all the Varicity configs of the specified project
     * @param projectName
     */
    public getConfigsFromProjectName(projectName: string): VaricityConfig[] {
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
        const config = VaricityConfigService.getYamlFromDisk(configPath) as VaricityConfig;
        if (config.camera_data === undefined) {
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

        let version = 1;
        if (this.db.exists('/configs')) {
            version = this.db.count('/configs') + 1;
        }
        // TODO improve versionning system
        const filename = "config-" + config.projectId + "-" + version;

        let parentDir=path.join(this.pathToVisualizationConfigs, config.projectId)
        if(!fs.existsSync(parentDir)){
            fs.mkdirSync(parentDir, { recursive: true });
        }
        fs.writeFileSync(path.join(parentDir, filename + ".yaml"), doc.toString());

        this.db.push('/configs[]', new ConfigEntry(filename, path.join(parentDir, filename + ".yaml"), config.projectId));
        //file written successfully
        return { config, filename: filename };
    }

    /**
     * Get the path of all the default configs
     * @private
     */
    private getDefaultConfigPaths(): string[] {
        return fs.readdirSync(this.pathToDefaultConfigs, { withFileTypes: true }).filter(f => f.isFile()).map(f => path.join(this.pathToDefaultConfigs, f.name));
    }

    /**
     * Get the path of all the configs for a specified project
     * @param projectName
     * @private
     */
    private getConfigsPaths(projectName: string): string[] {

        if (this.db.exists('/configs')) {
            return this.db.filter<ConfigEntry>('/configs', (config, index) => config.projectId == projectName).map(config => config.path);
        }
        return []
    }

    /**
     * Get the path of all the configs for a specified project
     * @param projectName
     * @private
     */
    private getConfigsPathsWithDefaultConfigsFallback(projectName: string): string[] {

        if (this.db.exists('/configs')) {
            let configsPath = this.db.filter<ConfigEntry>('/configs', (config, index) => config.projectId === projectName).map(config => config.path)
            if (configsPath.length > 0) {
                return configsPath;
            }

        }

        return this.getDefaultConfigPaths();
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
            configsNames.push(VaricityConfigService.getFileNameOnly(configPath));
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
    public getConfigsNamesAndFileNames(projectName: string): ConfigEntry[] {

        if (this.db.exists('/configs')) {
            let configsPath = this.db.filter<ConfigEntry>('/configs', (config, index) => config.projectId === projectName)
            if (configsPath && configsPath.length > 0) {
                return configsPath;
            }

        }

        //TODO
        return [new ConfigEntry('default global config', path.join(this.pathToDefaultConfigs, 'config.yaml'), '')];
    }

    /**
     * Get the Varicity config with the config name and it's project name
     * @param projectName equivalent to the config/projectName/... on disk
     * @param configName without the extension
     */
    public getConfigByNameFromProject(projectName: string, configName: string): VaricityConfig {
        const configsPaths = this.getConfigsPathsWithDefaultConfigsFallback(projectName);
        for (const configPath of configsPaths) {
            if (VaricityConfigService.getFileNameOnly(configPath) === configName) {
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
