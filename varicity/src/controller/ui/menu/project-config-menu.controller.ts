import {SubMenuInterface} from "./sub-menu.interface";

export class ProjectConfigMenuController implements SubMenuInterface {

    public defineSubMenuTitle(): string {
        return "Projects & Configurations"
    }

    public createMenu(parent: HTMLElement) {
        const projectConfigElement = document.getElementById("project-config_content");
        projectConfigElement.style.display = "block";

        projectConfigElement.setAttribute('open', 'true');
        projectConfigElement.setAttribute('scrimClickAction', 'close');
        projectConfigElement.setAttribute('escapeKeyAction', 'close');
    }

    public static stayOpen() {
        const projectConfigElement = document.getElementById("project-config_content");
        projectConfigElement.style.display = "block";

        projectConfigElement.setAttribute('open', 'true');
        projectConfigElement.setAttribute('scrimClickAction', '');
        projectConfigElement.setAttribute('escapeKeyAction', '');
    }
}
