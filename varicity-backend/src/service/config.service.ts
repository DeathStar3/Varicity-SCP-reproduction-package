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

    db = new JsonDB(new Config("configs-db", true, true, '/'));
    private configs: Map<string, VaricityConfig[]> = undefined; // TODO replace with json DB or just look up on FS
    private static defaultConfigName = "config";
    private static defaultConfigsPath = "./config/";

    constructor() {
        this.loadConfigs();
    }

    public loadDefaultConfig(): VaricityConfig {
        // Get document, or throw exception on error
        try {
            return ConfigService.getYamlFromDisk(ConfigService.defaultConfigsPath + ".yaml") as VaricityConfig;
            // return yaml.load(fs.readFileSync(path.join(process.cwd(), 'config/config.yaml'), 'utf8'));
        } catch (e) {
            console.log(e);
        }
    }

    public getAllFilenamesFromDisk(): string[] {
        let pathsWithStartDir = UtilsService.traverseDir(ConfigService.defaultConfigsPath);
        let paths = [];

        pathsWithStartDir.forEach(path => {
            let newPath =  path.replace(/\\+/g, "/");
            let newPathSplit = newPath.split('\/');
            newPathSplit.shift();
            paths.push(newPathSplit.join('/'))
        })

        return paths;
    }


    getAllConfigsName(projectName: string): string[] {
        const allFilesPaths = this.getAllFilenamesFromDisk();
        let projectNames = [];

        allFilesPaths.forEach(path => {
            if (!path.includes('/')) {
                projectNames.push(path.split('.json')[0]);
            }
        })

        return projectNames;
    }

    private loadConfigs(): void {
        // TODO: filter only .yaml or yml files, rn fetch all types of files
        const ymlFilePaths = this.getAllFilenamesFromDisk();
        console.log("ymlFilePaths", ymlFilePaths);

        this.configs = new Map<string, VaricityConfig[]>();

        ymlFilePaths.forEach((key) => {
            const config = ConfigService.getYamlFromDisk(key) as VaricityConfig;
            // console.log(config)

            if(config.camera_data === undefined){
                config.camera_data = new CameraData(2 * Math.PI / 3, Math.PI / 3, 100, new Vector3());
            }

            // check if config file is for specific project
            const projectName = ConfigService.getConfigProjectName(key);
            if (projectName !== undefined) {
                if (this.configs.has(projectName)) {
                    this.configs.get(projectName).push(config);
                } else {
                    this.configs.set(projectName, [config]);
                }

                // check if config file is the default one
            } else if (ConfigService.isDefaultProject(key)) {
                this.configs.set(ConfigService.defaultConfigName, [config]);
            }
        });

        // console.log('Loaded yaml files : ', this.configs);
    }

    public loadDataFile(fileName: string): VaricityConfig {
        if (this.configs === undefined) {
            this.loadConfigs();
        }

        if (this.configs.has(fileName)) {
            return this.configs.get(fileName)[0];
        } else {
            return this.configs.get(ConfigService.defaultConfigName)[0];
        }
    }

    public loadConfigFiles(fileName: string): VaricityConfig[] {
        console.log("fileName", fileName)
        if (this.configs === undefined) {
            this.loadConfigs();
        }

        if (this.configs.has(fileName)) {
            return this.configs.get(fileName);
        } else {
            return this.configs.get(ConfigService.defaultConfigName);
        }
    }

    private static getConfigProjectName(key: string) {
        const myRegexp = new RegExp("^([a-zA-Z\\-\\_.0-9]+)\\/[a-zA-Z\\-\\_.0-9]+\\.ya?ml$", "g");
        let match = myRegexp.exec(key);
        if (match !== undefined && match != null) {
            return match[1];
        } else {
            return undefined;
        }
    }

    private static isDefaultProject(key: string): boolean {
        const myRegexp = new RegExp("^([a-zA-Z\\-\\_.0-9]+)\\.ya?ml$", "g");
        let match = myRegexp.exec(key);
        return match !== undefined && match != null && match[1] === ConfigService.defaultConfigName;
    }

    private static getYamlFromDisk(pathLocal: string): any{
        return yaml.load(fs.readFileSync(path.join(process.cwd(), ConfigService.defaultConfigsPath, pathLocal), 'utf8'));
    }

    public saveConfig(config: VaricityConfig) {

        if (!config.projectId) {
            console.warn('projectId of config is not defined');
            return config;
        }

        if(this.configs.has(config.projectId)){
            this.configs.set(config.projectId, [...this.configs.get(config.projectId), config]);
        }else{
            this.configs.set(config.projectId, [config]);
        }

        // Saves file in filesystem
        const doc = new YAML.Document();
        doc.contents = config;

        console.log(doc.toString());

        fs.writeFile(path.join(ConfigService.defaultConfigsPath, config.projectId, "config-" + config.projectId + "-" + this.configs.get(config.projectId).length + ".yaml"),  doc.toString(), err => {
            if (err) {
                console.error(err)
                return
            }
            //file written successfully
        })

        return config;    
    }

    loadConfigFilesNames(configName: string) {
        return [];
    }
}
