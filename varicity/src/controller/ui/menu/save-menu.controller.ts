import {SubMenuInterface} from "./sub-menu.interface";

export class SaveMenuController implements SubMenuInterface {

    public defineSubMenuTitle(): string {
        return "Save"
    }

    public createMenu(parent: HTMLElement) {
        document.getElementById("save_content").setAttribute('open', 'true');
    }
}
