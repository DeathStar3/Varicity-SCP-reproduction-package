export class FsWatcherService {

    private CONFIG_DIRECTORY = 'dist/../config';
    private DATA_DIRECTORY = 'dist/../data/symfinder_files';

    public async instantiateWatcher(){
        const chokidar = require('chokidar');

        chokidar.watch(this.CONFIG_DIRECTORY).on('all', (event, path) => {
            console.log(event, path);
        });
        chokidar.watch(this.DATA_DIRECTORY).on('all', (event, path) => {
            console.log(event, path);
        });

        console.log("Watching directories:");
        console.log(" - " + this.CONFIG_DIRECTORY);
        console.log(" - " + this.DATA_DIRECTORY);
    }
}

export const fsWatcherService = new FsWatcherService();