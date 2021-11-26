import {ConfigLoader} from './controller/parser/configLoader';
import {UIController} from './controller/ui/ui.controller';
import {ProjectService} from './services/project.service';
import '@material/mwc-dialog';
import '@material/mwc-button/mwc-button';
import '@material/mwc-radio/mwc-radio';
import '@material/mwc-formfield/mwc-formfield';

class Main {

    constructor() {
        document.addEventListener('DOMContentLoaded', async (_ev) => {
            let projects = (await ProjectService.findAllProjectsName()).data;
            console.log("projects", projects);
            let configs = (await ConfigLoader.loadConfigFiles("config")).data;
            console.log("configs", configs);

            UIController.initSearchbar();
            UIController.createSaveSection();
            UIController.createDoc();
            UIController.createConfig(configs[0]);
            UIController.createProjectSelector(projects);
            UIController.createConfigSelector(configs, "");
            UIController.createLogs();
        })
    }
}

new Main();
