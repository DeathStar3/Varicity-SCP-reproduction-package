import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { ConfigEntry, ProjectEntry } from "src/model/experiment.model";
import { JsonInputInterface, MetricClassInterface } from "src/model/jsonInput.interface";
import { ProjectService } from "src/service/project.service";
const fsextra = require('fs-extra')
import * as fs from 'fs';
import { VaricityConfig } from "src/model/config.model";
import { VaricityConfigService } from "src/service/config.service";
var path = require('path');
@Injectable()
export class InitDBService implements OnApplicationBootstrap {


    private static EXTENSION = '.json'

    private readonly databasePath: string;
    private readonly pathToSymfinderJsons: string;
    private readonly pathToMetricsJsons: string;
    private readonly persistentDir: string;
    private readonly pathToParsedJsons: string;
    private readonly pathToVisualizationConfigs: string;

    private readonly db: JsonDB;

    constructor(private configService: ConfigService) {
        this.pathToSymfinderJsons = this.configService.get<string>('SYMFINDER_DIR');
        this.persistentDir = this.configService.get<string>('PERSISTENT_DIR');
        this.pathToMetricsJsons = this.configService.get<string>('METRICS_DIR');
        this.databasePath = this.configService.get<string>('DATABASE_PATH');
        this.pathToParsedJsons = this.configService.get<string>('PARSED_INPUT_DIR');
        this.pathToVisualizationConfigs = this.configService.get<string>('VISUALISATION_CONFIGS_PATH');

        this.db = new JsonDB(new Config(this.databasePath, true, true, '/'));
    }

    onApplicationBootstrap() {

        console.log('Application has started');
        this.createFoldersIfNotExists();
        this.findProjects();
        this.findConfigs();
    }


    createFoldersIfNotExists() {
        if (!fs.existsSync(this.pathToSymfinderJsons)) {
            console.log('The path to the symfinder Jsons does not exist yet, creating it');
            fs.mkdirSync(this.pathToSymfinderJsons, { recursive: true })
        }

        if (!fs.existsSync(this.pathToMetricsJsons)) {
            console.log('The path to the metrics Jsons does not exist yet, creating it');
            fs.mkdirSync(this.pathToMetricsJsons, { recursive: true })
        }


        if (!fs.existsSync(this.pathToVisualizationConfigs)) {
            console.log('The path to the configsdoes not exist yet, creating it');
            fs.mkdirSync(this.pathToVisualizationConfigs, { recursive: true });
        }
    }


    getExternalMetricsPaths(projectName: string) {
        let fullPath = path.join(this.pathToMetricsJsons, projectName);
        if (fs.existsSync(fullPath)) {
            return fs.readdirSync(fullPath, { withFileTypes: true })
                .filter(f => f.isFile() && path.extname(f.name).toLowerCase() === InitDBService.EXTENSION)
                .map(f => path.resolve(path.join(this.pathToMetricsJsons, projectName, f.name)));

        }
        return []

    }

    findConfigs() {
        let files = fs.readdirSync(this.pathToVisualizationConfigs, { withFileTypes: true });

        files.filter(f => f.isDirectory()).forEach(configFolder => {
            this.indexConfigFile(configFolder);
        })
    }


    indexConfigFile(configFolder: fs.Dirent) {
        let files = fs.readdirSync(path.join(this.pathToVisualizationConfigs, configFolder.name), { withFileTypes: true });

        files.filter(f => f.isFile()).forEach(configFile => {
            let configFilePath = path.join(this.pathToVisualizationConfigs, configFolder.name, configFile.name);

            if (!this.checkIfConfigIsIndexed(configFilePath)) {
                //we read the file to get the human readable name of the config but it is ok because we only do it once at startup
                const configObject = VaricityConfigService.getYamlFromDisk(configFilePath) as VaricityConfig;

                this.db.push('/configs[]', new ConfigEntry(configObject.name, configFilePath, configFolder.name));
            }
        });
    }
    

    findProjects() {
        let files = fs.readdirSync(this.pathToSymfinderJsons, { withFileTypes: true });

        files.filter(f => f.isFile() && path.extname(f.name).toLowerCase() === InitDBService.EXTENSION).
            filter(projectSymfinderFile => !this.checkIfParsed(path.parse(projectSymfinderFile.name).name)).forEach(projectSymfinderFile => {

                console.log(projectSymfinderFile.name)

                let fullPath = path.resolve(path.join(this.pathToSymfinderJsons, projectSymfinderFile.name));

                let symfinderObj = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as JsonInputInterface;

                let projectName = path.parse(projectSymfinderFile.name).name;

                let externalsMetricsPaths = this.getExternalMetricsPaths(projectName);


                if (externalsMetricsPaths.length !== 0) {

                    // index all classes indexes to reduce the complexity of merging external jsons.
                    let mapSymFinderClassesIndex = ProjectService.indexSymFinderClassesToMap(symfinderObj);

                    // loop over all the external metrics Json for the project
                    externalsMetricsPaths.forEach((externalsMetricsPath) => {

                        // get the object of external metrics
                        let externalMetricsClasses = JSON.parse(fs.readFileSync(externalsMetricsPath, 'utf8')) as MetricClassInterface[];

                        // loop over all the classes in the external jsons object
                        externalMetricsClasses.forEach((classMetrics) => {

                            if (mapSymFinderClassesIndex.has(classMetrics.name)) {
                                const index = mapSymFinderClassesIndex.get(classMetrics.name);
                                if (symfinderObj.nodes[index].additionalMetrics === undefined) {
                                    symfinderObj.nodes[index].additionalMetrics = [];
                                }

                                // aggregate the metrics in the SymFinder object classes.
                                classMetrics.metrics.forEach((metric) => {
                                    symfinderObj.nodes[index].additionalMetrics.push(metric);
                                });
                            }
                        });
                    });
                }
                let parsedInputPath = path.join(this.pathToParsedJsons, projectName);
                fs.mkdirSync(this.pathToParsedJsons, { recursive: true })
                fsextra.writeJsonSync(`${parsedInputPath}.json`, symfinderObj, { flag: 'w+', recursive: true })
                this.db.push('/projects[]', new ProjectEntry(projectName, parsedInputPath + '.json'));

            });
    }

    /**
     * To check if a file is already parsed we will use the database instead of the filesystem
     * If a change is done manually on the filesystem to the 'gross' results then the user has the responsibility to remove
     * the previous parsed result and delete the entry from the database.
     * @param projectName 
     */
    checkIfParsed(projectName: string) {
        if (this.db.exists('/projects')) {
            return this.db.getIndex('/projects', projectName, 'projectName') > -1;
        }
        return false;
    }

    checkIfConfigIsIndexed(configFilePath) {
        if (this.db.exists('/configs')) {
            return this.db.getIndex('/configs', configFilePath, 'path') > -1
        }
        return false;
    }

}