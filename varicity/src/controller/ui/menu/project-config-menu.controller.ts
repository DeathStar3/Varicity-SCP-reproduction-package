import {SubMenuInterface} from "./sub-menu.interface";

export class ProjectConfigMenuController implements SubMenuInterface {

    public defineSubMenuTitle(): string {
        return "Projects & Configurations"
    }

    public createMenu(parent: HTMLElement) {
        document.getElementById("project-config_content").setAttribute('open', 'true');
        document.getElementById("project-config_content").setAttribute('scrimClickAction', 'close');
        document.getElementById("project-config_content").setAttribute('escapeKeyAction', 'close');
    }

    public static stayOpen() {
        document.getElementById("project-config_content").setAttribute('open', 'true');
        document.getElementById("project-config_content").setAttribute('scrimClickAction', '');
        document.getElementById("project-config_content").setAttribute('escapeKeyAction', '');
    }
}
