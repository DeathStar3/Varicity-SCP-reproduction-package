import {UIController} from "./ui.controller";
import {SaveController} from "./save.controller";
import {MenuController} from "./menu/menu.controller";

export class InputKeyController {

    public static createInputKeyListener() {

        const saveConfirmElement = document.getElementById("save-dialog");
        saveConfirmElement.style.display = "block";

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {// CTRL + SHIFT + S
                e.preventDefault(); // Prevent the Save dialog to open

                if (UIController.config) {
                    console.log("(CTRL + SHIFT + S) Open save dialog box for: " + UIController.configFileName.filename)
                    SaveController.saveNewConfig();
                }
            } else if (e.ctrlKey && e.key.toLowerCase() === 's') { // CTRL + S
                e.preventDefault(); // Prevent the Save dialog to open
                if (UIController.config) {
                    console.log("(CTRL + S) Update config for: " + UIController.configFileName.filename)
                    SaveController.updateConfiguration();
                }
            } else if (e.ctrlKey && e.key.toLowerCase() === 'p') { // CTRL + P
                e.preventDefault(); // Prevent the Save dialog to open
                if (UIController.config) {
                    console.log("(CTRL + P) Update camera for: " + UIController.configFileName.filename)
                    SaveController.saveCamera();
                    SaveController.updateConfiguration();
                }
            } else if (e.key !== undefined && e.key.toLowerCase() === "escape") { // Escape
                console.log("(ESCAPE) Closing menu if open")
                if (MenuController.selectedTab) {
                    MenuController.closeMenu();
                }
            }
        });
    }
}
