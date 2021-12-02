import '@material/mwc-button/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-formfield/mwc-formfield';
import '@material/mwc-radio/mwc-radio';
import { UIController } from './controller/ui/ui.controller';
import { ProjectService } from './services/project.service';

class Main {

    constructor() {
        document.addEventListener('DOMContentLoaded', async (_ev) => {
            let projects = (await ProjectService.findAllProjectsName()).data;
            console.log("projects", projects);

            UIController.initSearchbar();
            UIController.createSaveSection();
            UIController.createMenu();
            UIController.createProjectSelector(projects);
            UIController.createLogs();
        })
    }
}

new Main();
