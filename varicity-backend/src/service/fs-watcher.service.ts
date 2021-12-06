import { ConfigService } from "@nestjs/config";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";


export class FsWatcherService {

    private readonly pathToVisualizationConfigs: string;
    private readonly pathToSymfinderJsons: string;

    
    private readonly db: JsonDB;
    private readonly databasePath;
    constructor(private configService: ConfigService) {
       
        this.databasePath = this.configService.get<string>('DATABASE_PATH');
        this.pathToVisualizationConfigs = this.configService.get<string>('VISUALISATION_CONFIGS_PATH');
        this.pathToSymfinderJsons = this.configService.get<string>('SYMFINDER_DIR');
        this.db = new JsonDB(new Config(this.databasePath, true, true, '/'));
    }

    /**
     * Instantiate watchers for config files and data files
     * It also clean the database when the server is started
     */
    public async instantiateWatcher() {

        //Clean local database
        this.db.delete('/');

        const chokidar = require('chokidar');

        chokidar.watch(this.pathToVisualizationConfigs).on('all', (event, path) => {
            console.log(event, path);
            switch (event) {
                case "add":
                    this.indexConfigFile(path);
                    break;
                case "unlink":
                    this.deIndexConfigFile(path);
                    break;
            }
        });
        chokidar.watch(this.pathToSymfinderJsons).on('all', (event, path) => {
            console.log(event, path);
            switch (event) {
                case "add":
                    this.indexDataFile(path);
                    break;
                case "unlink":
                    this.deIndexDataFile(path);
                    break;
            }
        });

        console.log("Watching directories:");
        console.log(" - " + this.pathToVisualizationConfigs);
        console.log(" - " + this.pathToSymfinderJsons);
    }

    /**
     * Index a config file
     */
    public indexConfigFile(configFilePath: string) {
        const paths: string[] = []
        if (this.db.exists('/configs/' + this.getConfigProjectName(configFilePath))) {
            paths.push(...this.db.getData('/configs/' + this.getConfigProjectName(configFilePath)))
        }
        paths.push(this.normalizeConfigFileName(configFilePath))
        this.db.push('/configs/' + this.getConfigProjectName(configFilePath), paths);
    }

    /**
     * DeIndex a deleted config file
     */
    public deIndexConfigFile(configFilePath: string) {
        const paths: string[] = []
        if (this.db.exists('/configs/' + this.getConfigProjectName(configFilePath))) {

            paths.push(...this.db.getData('/configs/' + this.getConfigProjectName(configFilePath)))

            const index = paths.indexOf(this.normalizeConfigFileName(configFilePath));
            if (index > -1) {
                paths.splice(index, 1);
            }
        }
        if (paths.length === 0) {
            this.db.delete('/configs/' + this.getConfigProjectName(configFilePath));
        } else {
            this.db.push('/configs/' + this.getConfigProjectName(configFilePath), paths);
        }
    }

    /**
     * Index a data file
     */
    public indexDataFile(dataFilePath: string) {
        const paths: string[] = []
        if (this.db.exists('/data/' + this.getDataProjectName(dataFilePath))) {
            paths.push(...this.db.getData('/data/' + this.getDataProjectName(dataFilePath)))
        }
        paths.push(this.normalizeDataFileName(dataFilePath))
        this.db.push('/data/' + this.getDataProjectName(dataFilePath), paths);
    }

    /**
     * DeIndex a deleted data file
     */
    public deIndexDataFile(dataFilePath: string) {
        const paths: string[] = []
        if (this.db.exists('/data/' + this.getDataProjectName(dataFilePath))) {

            paths.push(...this.db.getData('/data/' + this.getDataProjectName(dataFilePath)))

            const index = paths.indexOf(this.normalizeDataFileName(dataFilePath));
            if (index > -1) {
                paths.splice(index, 1);
            }
        }
        if (paths.length === 0) {
            this.db.delete('/data/' + this.getDataProjectName(dataFilePath));
        } else {
            this.db.push('/data/' + this.getDataProjectName(dataFilePath), paths);
        }

    }

    /**
     * Get the project name from config file path
     */
    public getConfigProjectName(path: string): string {
        let newPath = path.replace(/\\+/g, "/");
        let newPathSplit = newPath.split('\/');
        return newPathSplit[1];
    }

    /**
     * Get the project name from data file path
     */
    public getDataProjectName(path: string): string {
        let newPath = path.replace(/\\+/g, "/");
        let newPathSplit = newPath.split('\/');
        if (newPathSplit[2] === 'externals') {
            return newPathSplit[3];
        } else {
            return newPathSplit[2].replace(".json", "");
        }
    }

    /**
     * Normalize data file path (remove "data/symfinder_files/")
     */
    public normalizeDataFileName(path: string): string {
        let newPath = path.replace(/\\+/g, "/");
        let newPathSplit = newPath.split('\/');
        newPathSplit.shift(); // Remove "data/"
        newPathSplit.shift(); // Remove "symfinder_files/"
        return newPathSplit.join('/');
    }

    /**
     * Normalize config file path (remove "config/)
     */
    public normalizeConfigFileName(path: string): string {
        let newPath = path.replace(/\\+/g, "/");
        let newPathSplit = newPath.split('\/');
        newPathSplit.shift(); // Remove "config/"
        return newPathSplit.join('/');
    }

}


