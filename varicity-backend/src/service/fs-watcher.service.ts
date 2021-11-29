import {AppModule} from "../app.module";

export class FsWatcherService {

    private CONFIG_DIRECTORY = 'dist/../config';
    private DATA_DIRECTORY = 'dist/../data/symfinder_files';

    /**
     * Instantiate watchers for config files and data files
     * It also clean the database when the server is started
     */
    public async instantiateWatcher() {

        //Clean local database
        AppModule.DB.delete("/");

        const chokidar = require('chokidar');

        chokidar.watch(this.CONFIG_DIRECTORY).on('all', (event, path) => {
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
        chokidar.watch(this.DATA_DIRECTORY).on('all', (event, path) => {
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
        console.log(" - " + this.CONFIG_DIRECTORY);
        console.log(" - " + this.DATA_DIRECTORY);
    }

    /**
     * Index a config file
     */
    public indexConfigFile(configFilePath: string) {
        const paths: string[] = []
        if (AppModule.DB.exists('/config/' + this.getConfigProjectName(configFilePath))) {
            paths.push(...AppModule.DB.getData('/config/' + this.getConfigProjectName(configFilePath)))
        }
        paths.push(this.normalizeConfigFileName(configFilePath))
        AppModule.DB.push('/config/' + this.getConfigProjectName(configFilePath), paths);
    }

    /**
     * DeIndex a deleted config file
     */
    public deIndexConfigFile(configFilePath: string) {
        const paths: string[] = []
        if (AppModule.DB.exists('/config/' + this.getConfigProjectName(configFilePath))) {

            paths.push(...AppModule.DB.getData('/config/' + this.getConfigProjectName(configFilePath)))

            const index = paths.indexOf(this.normalizeConfigFileName(configFilePath));
            if (index > -1) {
                paths.splice(index, 1);
            }
        }
        if (paths.length === 0){
            AppModule.DB.delete('/config/' + this.getConfigProjectName(configFilePath));
        } else {
            AppModule.DB.push('/config/' + this.getConfigProjectName(configFilePath), paths);
        }
    }

    /**
     * Index a data file
     */
    public indexDataFile(dataFilePath: string) {
        const paths: string[] = []
        if (AppModule.DB.exists('/data/' + this.getDataProjectName(dataFilePath))) {
            paths.push(...AppModule.DB.getData('/data/' + this.getDataProjectName(dataFilePath)))
        }
        paths.push(this.normalizeDataFileName(dataFilePath))
        AppModule.DB.push('/data/' + this.getDataProjectName(dataFilePath), paths);
    }

    /**
     * DeIndex a deleted data file
     */
    public deIndexDataFile(dataFilePath: string) {
        const paths: string[] = []
        if (AppModule.DB.exists('/data/' + this.getDataProjectName(dataFilePath))) {

            paths.push(...AppModule.DB.getData('/data/' + this.getDataProjectName(dataFilePath)))

            const index = paths.indexOf(this.normalizeDataFileName(dataFilePath));
            if (index > -1) {
                paths.splice(index, 1);
            }
        }
        if (paths.length === 0){
            AppModule.DB.delete('/data/' + this.getDataProjectName(dataFilePath));
        } else {
            AppModule.DB.push('/data/' + this.getDataProjectName(dataFilePath), paths);
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

export const fsWatcherService = new FsWatcherService();