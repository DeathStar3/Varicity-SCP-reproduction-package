import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {ToastController, ToastType} from "../toast.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {SearchbarController} from "../searchbar.controller";
export class BlacklistController {

    public static createMenu() {
        const parent = SubMenuController.getParentContentSubMenu();
        SubMenuController.changeTitleSubMenuElement("Blacklist");

        const menuBlacklist = SubMenuController.createMenu("Blacklist", true, parent);

        if (UIController.config) {

            // fetch the links
            const blacklist = UIController.config.blacklist; // TODO find a better way than getting a static value, pass it in arguments?

            // Blacklisted class
            const inputs = []
            for (let i = 0; i < blacklist.length; i++) {
                let className = blacklist[i];
                this.createClassInput(inputs, blacklist, parent, className);
            }
            this.createClassInput(inputs, blacklist, parent);
        }
    }

    private static createClassInput(inputs, apiClasses, parent, text?: string) {
        let className = text || "";
        const input = SubMenuController.createOnlyInputText(className, "ex.package.class", parent);

        input.setAttribute("list", "datalist");

        inputs.push(input);

        input.addEventListener("search", (event) => {
            const isInputLastInTheList = inputs.indexOf(input) == inputs.length - 1;
            const isAlreadyInBlacklist = apiClasses.indexOf(input.value) !== -1;

            // Handle error where the input hasn't change
            if(className === input.value){
                ToastController.addToast("The input hasn't change...", ToastType.INFO);
                return;
            }

            // Handle error where the input already exist in an other input text
            if(isAlreadyInBlacklist){
                ToastController.addToast("The class: '" + input.value + "' already exist in the blacklist. You can't add it a second time...", ToastType.DANGER);
                input.value = className; // reset value to the last one
                return;
            }

            if (!SearchbarController.map.has(input.value)) { // the search key doesn't exist
                input.style.border = "1px solid red";
            }else {
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
                    this.createClassInput(inputs, apiClasses, parent);
                    UIController.updateScene(CriticalLevel.REPARSE_DATA);
                }

                className = input.value;
            }
        })
    }
}
