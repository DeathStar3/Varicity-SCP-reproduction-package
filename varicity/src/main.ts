import '@material/mwc-button/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-formfield/mwc-formfield';
import '@material/mwc-radio/mwc-radio';
import {UIController} from './controller/ui/ui.controller';
import {ProjectService} from './services/project.service';
import {InputKeyController} from "./controller/ui/input-key.controller";
import {ProjectController} from "./controller/ui/project-selector.controller";
import {SearchbarController} from "./controller/ui/searchbar.controller";

class Main {

    constructor() {
        UIController.setBackgroundColorSameAsCanvas();
        UIController.createSaveSection();
        UIController.createLogs();

        ProjectService.findAllProjectsName().then((response) => {
            const projects: string[] = response.data;
            console.log("projects", projects);

            // Select a project.
            const selectedProject = this.getQueryParam('project');
            if (selectedProject && projects.indexOf(selectedProject) != -1) {
                console.log("selected project:", selectedProject)
                ProjectController.loadProject(selectedProject);
            }

            // Open the project selector.
            else {
                UIController.createProjectSelector(projects);
                UIController.createProjectSelectorStayOpen();
            }

            UIController.createMenu();
            UIController.initSearchbar();
            InputKeyController.createInputKeyListener();

            // Select a class.
            const selectedClass = this.getQueryParam('class');
            if (selectedClass) {
                console.log("selected class:", selectedClass)
                SearchbarController.focusOn(selectedClass);
            }
        })
    }

    public getQueryParam(name: string): string {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(name);
    }

}

new Main();
