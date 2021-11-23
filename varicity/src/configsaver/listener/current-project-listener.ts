
export class CurrentProjectListener {

    private currentProject: string;
    public projectChange(newProject: string): void {

        
        if (this.currentProject) {
            console.log(" Visualized Project changed from " + this.currentProject + " to " + newProject);
            this.currentProject = newProject;
        }
        else {
            console.log(" Visualized Project is " + newProject);
            this.currentProject = newProject;
        }


        /**
         * TODO 
         * - find if there is one or more configs associated with this project 
         * - load the appropriate one based on the username and userType
         * - modify the camera using the config loaded
         * - create a save button / form on the UI so the user can save its config
         */
    }
}