import {UIController} from "./ui.controller";
import Cookies from "js-cookie";
import {SaveController} from "./save.controller";

export class InputKeyController {

    public static createInputKeyListener() {
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {// CTRL + SHIFT + S
                e.preventDefault(); // Prevent the Save dialog to open

                if (UIController.config) {
                    document.querySelector('#save-dialog').setAttribute('open', 'true');
                    UIController.config.projectId = Cookies.get('varicity-current-project');
                    (document.querySelector('#text-field-configname') as HTMLInputElement).value = UIController.config.name || "";
                    console.log('CTRL + SHIFT + S');
                }
            } else if (e.ctrlKey && e.key.toLowerCase() === 's') { // CTRL + S
                e.preventDefault(); // Prevent the Save dialog to open
                if (UIController.config) {
                    SaveController.updateConfiguration();
                    console.log('CTRL + S');
                }
            }
        });
    }
}