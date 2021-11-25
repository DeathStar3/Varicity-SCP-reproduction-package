import { ConfigLoader } from './controller/parser/configLoader';
import { SaveConfigController } from './controller/ui/save.config.controller';
import { UIController } from './controller/ui/ui.controller';
import { ProjectService } from './services/project.service';

class Main {



    constructor() {

        document.addEventListener('DOMContentLoaded', async (_ev) => {
            let jsonFiles = (await ProjectService.findAllProjectsName()).data;
            console.log(jsonFiles);
            let configs = (await ConfigLoader.loadConfigFiles("config")).data;

            

            UIController.initSearchbar();
            UIController.createConfig(configs[0]);
            UIController.createDoc();
            UIController.createProjectSelector(jsonFiles);
            UIController.createConfigSelector(configs, "");
            UIController.createLogs();

            new SaveConfigController();

        })



    }
}
new Main();
