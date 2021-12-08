import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {ToastController, ToastType} from "../toast.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {SearchbarController} from "../searchbar.controller";
import {SubMenuInterface} from "./sub-menu.interface";
import {Orientation} from "../../../model/entitiesImplems/orientation.enum";

export class ApiAndBlacklistController implements SubMenuInterface {

    private static maxLevelUsage = 0;

    defineSubMenuTitle(): string {
        return "APIs and Blacklist";
    }

    public createMenu(parent: HTMLElement) {
        const menuOrientation = SubMenuController.createMenu("Orientation and Level usage", true, parent);
        const menuAPIClasses = SubMenuController.createMenu("API classes", true, parent);
        const menuBlacklist = SubMenuController.createMenu("Blacklist", true, parent);

        if (UIController.config) {
            this.populateOrientationAndLevelUsage(menuOrientation);
            this.populateApiClasses(menuAPIClasses);
            this.populateBlackList(menuBlacklist);
        }
    }

    public static defineMaxLevelUsage(max: number) {
        ApiAndBlacklistController.maxLevelUsage = max;
    }

    private populateBlackList(parent: HTMLElement) {
        // fetch the links
        const blacklist = UIController.config.blacklist;

        // Blacklisted class
        const inputs = []
        for (let i = 0; i < blacklist.length; i++) {
            let className = blacklist[i];
            this.createClassInputBlackList(inputs, blacklist, parent, className);
        }
        this.createClassInputBlackList(inputs, blacklist, parent);
    }


    private populateOrientationAndLevelUsage(parent: HTMLElement) {
        // Orientation
        let orientationOptions = ["IN", "OUT", "IN_OUT"];
        const select = SubMenuController.createSelect("Orientation", UIController.config.orientation, parent, orientationOptions)

        select.addEventListener("change", () => {
            UIController.config.orientation = select.value as Orientation;
            UIController.updateScene(CriticalLevel.REPARSE_DATA);
        })

        // Level usage
        const range = SubMenuController.createRange("Level usage", UIController.config.default_level, 0, ApiAndBlacklistController.maxLevelUsage, 1, parent);
        range.addEventListener("change", () => {
            UIController.config.default_level = +range.value;
            UIController.updateScene(CriticalLevel.REPARSE_DATA);
        })
    }

    private populateApiClasses(parent: HTMLElement) {
        const apiClasses = UIController.config.api_classes;
        const inputs = []

        // API classes
        for (let i = 0; i < apiClasses.length; i++) {
            let className = apiClasses[i];
            this.createClassInputAPI(inputs, apiClasses, parent, className);
        }

        this.createClassInputAPI(inputs, apiClasses, parent);
    }


    private createClassInputBlackList(inputs, apiClasses, parent, text?: string) {
        let className = text || "";
        const input = SubMenuController.createOnlyInputText(className, "ex.package.class", parent);

        input.setAttribute("list", "datalist-classes");

        inputs.push(input);

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === "Clear") {
                const isInputLastInTheList = inputs.indexOf(input) == inputs.length - 1;
                const isApiAlreadyInList = apiClasses.indexOf(input.value) !== -1;

                // Handle error where the input hasn't change
                if (className === input.value) {
                    ToastController.addToast("The input hasn't change...", ToastType.INFO);
                    return;
                }

                // Handle error where the input already exist in an other input text
                if (isApiAlreadyInList) {
                    ToastController.addToast("The class: '" + input.value + "' already exist in the API classes. You can't add it a second time...", ToastType.DANGER);
                    input.value = className; // reset value to the last one
                    return;
                }

                if (!SearchbarController.classList.includes(input.value) && input.value !== "") { // the search key doesn't exist
                    input.style.border = "1px solid red";
                } else {
                    input.style.border = "2px solid #ced4da";

                    // Update the config and scene depending on the position in the list of the input box
                    if (!isInputLastInTheList) {
                        if (input.value === "") { // clear an input that is not at the end, so remove it from the list
                            apiClasses.splice(apiClasses.indexOf(className), 1);
                            input.parentElement.remove(); // input has a parent div generated with it
                            UIController.updateScene(CriticalLevel.REPARSE_DATA);
                        } else {
                            apiClasses[apiClasses.indexOf(className)] = input.value;
                            UIController.updateScene(CriticalLevel.REPARSE_DATA);
                        }

                    } else if (input.value !== "") { // if is the last input and has a value, then add a new input text at the end.
                        apiClasses.push(input.value);
                        this.createClassInputBlackList(inputs, apiClasses, parent);
                        UIController.updateScene(CriticalLevel.REPARSE_DATA);
                    }

                    className = input.value;
                }
            }
        })
    }

    private createClassInputAPI(inputs, apiClasses, parent, text?: string) {
        let className = text || "";
        const input = SubMenuController.createOnlyInputText(className, "ex.package.class", parent);

        input.setAttribute("list", "datalist-classes");

        inputs.push(input);

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === "Clear") {
                const isInputLastInTheList = inputs.indexOf(input) == inputs.length - 1;
                const isAlreadyInBlacklist = apiClasses.indexOf(input.value) !== -1;

                // Handle error where the input hasn't change
                if (className === input.value) {
                    ToastController.addToast("The input hasn't change...", ToastType.INFO);
                    return;
                }

                // Handle error where the input already exist in an other input text
                if (isAlreadyInBlacklist) {
                    ToastController.addToast("The class: '" + input.value + "' already exist in the blacklist. You can't add it a second time...", ToastType.DANGER);
                    input.value = className; // reset value to the last one
                    return;
                }

                if (!SearchbarController.classList.includes(input.value) && input.value !== "") { // the search key doesn't exist
                    input.style.border = "1px solid red";
                } else {
                    input.style.border = "1px solid #ced4da";
                    document.getElementById("loading-frame").style.display = 'inline-block'; //TODO issue: is not displayed before the following code

                    // Update the config and scene depending on the position in the list of the input box
                    if (!isInputLastInTheList) {
                        if (input.value === "") { // clear an input that is not at the end, so remove it from the list
                            apiClasses.splice(apiClasses.indexOf(className), 1);
                            input.parentElement.remove(); // input has a parent div generated with it
                            UIController.updateScene(CriticalLevel.REPARSE_DATA);
                        } else {
                            apiClasses[apiClasses.indexOf(className)] = input.value;
                            UIController.updateScene(CriticalLevel.REPARSE_DATA);
                        }

                    } else if (input.value !== "") { // if is the last input and has a value, then add a new input text at the end.
                        apiClasses.push(input.value);
                        this.createClassInputAPI(inputs, apiClasses, parent);
                        UIController.updateScene(CriticalLevel.REPARSE_DATA);
                    }

                    className = input.value;
                }
            }
        })
    }
}
