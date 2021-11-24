import { UIController } from './controller/ui/ui.controller';
import { ConfigLoader } from './controller/parser/configLoader';
import { FilesLoader } from './controller/parser/filesLoader';
import { SaveConfigController } from './controller/ui/save.config.controller';

class Main {



    constructor() {
        let jsonFiles = FilesLoader.getAllFilenames();

        let configs = ConfigLoader.loadConfigFiles("config");

        UIController.initSearchbar();
        UIController.createConfig(configs[0]);
        UIController.createDoc();
        UIController.createProjectSelector(jsonFiles);
        UIController.createConfigSelector(configs, "");
        UIController.createLogs();

        new SaveConfigController();
        
    }
}
new Main();
