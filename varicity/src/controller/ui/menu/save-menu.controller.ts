import {SubMenuInterface} from "./sub-menu.interface";

export class SaveMenuController implements SubMenuInterface {

    public defineSubMenuTitle(): string {
        return "Save"
    }

    public createMenu(parent: HTMLElement) {
        const saveElement = document.getElementById("save_content");
        saveElement.style.display = "block";
        const saveConfirmElement = document.getElementById("save-dialog");
        saveConfirmElement.style.display = "block";

        saveElement.setAttribute('open', 'true');
    }
}
