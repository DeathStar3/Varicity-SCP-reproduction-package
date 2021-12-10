import Cookies from "js-cookie";
import {UIController} from "../../controller/ui/ui.controller";

export class CurrentProjectListener {

    private currentProject: string;

    public projectChange(newProject: string): void {

        if (this.currentProject && this.currentProject !== newProject) {
            console.log(" Visualized Project changed from " + this.currentProject + " to " + newProject);
            this.currentProject = newProject;
            UIController.config.projectId = this.currentProject;
        } else {
            console.log(" Visualized Project is " + newProject);
            this.currentProject = newProject;
            UIController.config.projectId = this.currentProject;
        }

        Cookies.set('varicity-current-project', this.currentProject, {sameSite: 'strict'});


        /**
         * TODO
         * - find if there is one or more configs associated with this project
         * - load the appropriate one based on the username and userType
         * - modify the camera using the config loaded
         * - create a save button / form on the UI so the user can save its config
         */
    }
}
