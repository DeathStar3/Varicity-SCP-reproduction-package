import '@material/mwc-button/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-formfield/mwc-formfield';
import '@material/mwc-radio/mwc-radio';
import { UIController } from './controller/ui/ui.controller';
import { ProjectService } from './services/project.service';

class Main {

    constructor() {
        document.addEventListener('DOMContentLoaded', async (_ev) => {
            UIController.initSearchbar();
            UIController.createSaveSection();
            UIController.createLogs();

            let projects = (await ProjectService.findAllProjectsName()).data;
            console.log("projects", projects);

            UIController.createProjectSelector(projects);
            UIController.createMenu();
        })
    }
}

new Main();
