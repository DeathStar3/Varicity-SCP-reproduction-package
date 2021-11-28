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

            UIController.initSearchbar();
            UIController.createSaveSection();
            UIController.createDoc();
            UIController.createProjectSelector(projects);
            UIController.createLogs();
        })
    }
}

new Main();
