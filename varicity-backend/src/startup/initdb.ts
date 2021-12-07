import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from 'fs';
import { VaricityConfig } from "src/model/config.model";
import { ConfigEntry } from "src/model/experiment.model";
import { VaricityConfigService } from "src/service/config.service";
import { DbFacadeService } from "src/service/db-facade/db-facade.service";
import { FsWatcherService } from "src/service/fs-watcher.service";
import { ProjectService } from "src/service/project.service";
const path = require('path');


@Injectable()
export class InitDBService implements OnApplicationBootstrap {


    static EXTENSION = '.json'
    private readonly pathToSymfinderJsons: string;
    private readonly pathToMetricsJsons: string;
    private readonly persistentDir: string;
    private readonly pathToParsedJsons: string;
    private readonly pathToVisualizationConfigs: string;


    //For the watcher

    private readonly watchDirectories: number;
    private readonly pathToWatchedConfigsDir: string;
    private readonly pathToWatchedSymfinderJsons: string;

    constructor(@Inject(DbFacadeService) private readonly dbFacade: DbFacadeService, @Inject(VaricityConfigService) private readonly varicityConfigService: VaricityConfigService,
        @Inject(ProjectService) private readonly projectService: ProjectService,
        @Inject(ConfigService) private configService: ConfigService, @Inject(FsWatcherService) private readonly watcherService: FsWatcherService) {
        this.pathToSymfinderJsons = this.configService.get<string>('SYMFINDER_DIR');
        this.persistentDir = this.configService.get<string>('PERSISTENT_DIR');
        this.pathToMetricsJsons = this.configService.get<string>('METRICS_DIR');

        this.pathToParsedJsons = this.configService.get<string>('PARSED_INPUT_DIR');
        this.pathToVisualizationConfigs = this.configService.get<string>('VISUALISATION_CONFIGS_PATH');

        this.watchDirectories = this.configService.get<number>('WATCH_DIRECTORIES');
        this.pathToWatchedConfigsDir = this.configService.get<string>('WATCHED_CONFIGS_DIR');
        this.pathToWatchedSymfinderJsons = this.configService.get<string>('WATCHED_SYMFINDER_DIR');


    }

    onApplicationBootstrap() {

        console.log('Application has started');
        this.createFoldersIfNotExists();
        this.findProjects();
        this.findConfigs();

        this.handleWatcher();
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

        if (this.watchDirectories != 0) {
            ///
            if (!fs.existsSync(this.pathToWatchedSymfinderJsons)) {
                console.log('The path to the Watched symfinder Jsons does not exist yet, creating it');
                fs.mkdirSync(this.pathToWatchedSymfinderJsons, { recursive: true })
            }


            if (!fs.existsSync(this.pathToWatchedConfigsDir)) {
                console.log('The path to the watched configs does not exist yet, creating it');
                fs.mkdirSync(this.pathToWatchedConfigsDir, { recursive: true });
            }
        }
    }




    findConfigs() {
        const files = fs.readdirSync(this.pathToVisualizationConfigs, { withFileTypes: true });

        files.filter(f => f.isDirectory()).forEach(configFolder => {
            this.indexConfigFile(configFolder);
        })
    }


    indexConfigFile(configFolder: fs.Dirent) {
        const files = fs.readdirSync(path.join(this.pathToVisualizationConfigs, configFolder.name), { withFileTypes: true });

        files.filter(f => f.isFile()).forEach(configFile => {
            const configFilePath = path.join(this.pathToVisualizationConfigs, configFolder.name, configFile.name);

            if (!this.varicityConfigService.checkIfConfigIsIndexed(configFilePath)) {
                //we read the file to get the human readable name of the config but it is ok because we only do it once at startup
                const configObject = VaricityConfigService.getYamlFromDisk(configFilePath) as VaricityConfig;

                this.dbFacade.db.push('/configs[]', new ConfigEntry(configObject.name, configFilePath, configFolder.name));
            }
        });
    }

    findProjects() {
        const files = fs.readdirSync(this.pathToSymfinderJsons, { withFileTypes: true });

        files.filter(f => f.isFile() && path.extname(f.name).toLowerCase() === InitDBService.EXTENSION).
            filter(projectSymfinderFile => !this.projectService.checkIfParsed(path.parse(projectSymfinderFile.name).name)).forEach(projectSymfinderFile => {

                console.log(projectSymfinderFile.name)

                const fullPath = path.resolve(path.join(this.pathToSymfinderJsons, projectSymfinderFile.name));

                const projectName = path.parse(projectSymfinderFile.name).name;

                this.watcherService.parseSymfinderJsons(fullPath, projectName);
            });
    }


    handleWatcher() {
        if (this.watchDirectories != 0 && this.pathToWatchedConfigsDir !== this.pathToVisualizationConfigs  && this.pathToSymfinderJsons !== this.pathToWatchedSymfinderJsons) {
            console.log('Watch directory is set to true');
            this.watcherService.instantiateWatcher();
        }
    }

}