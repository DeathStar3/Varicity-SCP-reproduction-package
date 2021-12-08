import {UIController} from "./ui.controller";
import Cookies from "js-cookie";
import {SaveController} from "./save.controller";

export class InputKeyController {

    public static createInputKeyListener() {

        const saveConfirmElement = document.getElementById("save-dialog");
        saveConfirmElement.style.display = "block";

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {// CTRL + SHIFT + S
                e.preventDefault(); // Prevent the Save dialog to open

                if (UIController.config) {
                    console.log("(CTRL + SHIFT + S) Open save dialog box for: " + UIController.configFileName)
                    document.querySelector('#save-dialog').setAttribute('open', 'true');
                    UIController.config.projectId = Cookies.get('varicity-current-project');
                    (document.querySelector('#text-field-configname') as HTMLInputElement).value = UIController.config.name || "";
                }
            } else if (e.ctrlKey && e.key.toLowerCase() === 's') { // CTRL + S
                e.preventDefault(); // Prevent the Save dialog to open
                if (UIController.config) {
                    console.log("(CTRL + S) Update config for: " + UIController.configFileName)
                    SaveController.updateConfiguration();
                }
            } else if (e.ctrlKey && e.key.toLowerCase() === 'p') { // CTRL + P
                e.preventDefault(); // Prevent the Save dialog to open
                if (UIController.config) {
                    console.log("(CTRL + P) Update camera for: " + UIController.configFileName)
                    SaveController.saveCamera();
                    SaveController.updateConfiguration();
                }
            }
        });
    }
}
