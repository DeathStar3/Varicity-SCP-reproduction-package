import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {Orientation} from "../../../model/entitiesImplems/orientation.enum";
import {ToastController} from "../toast.controller";

export class MetricController {

    private static maxLevelUsage = 0;

    public static createMenu() {
        const parent = SubMenuController.getParentContentSubMenu();

        // set title
        SubMenuController.changeTitleSubMenuElement("Metrics and APIs");

        const menuOrientation = SubMenuController.createMenu("Orientation and Level usage", true, parent);
        const menuAPIClasses = SubMenuController.createMenu("API classes", true, parent);
        const menuVariables = SubMenuController.createMenu("Variables", true, parent);
        const menuMetrics = SubMenuController.createMenu("Metrics", true, parent);

        if (UIController.config) {
            this.populateOrientationAndLevelUsage(menuOrientation);
            this.populateApiClasses(menuAPIClasses);
            this.populateVariables(menuVariables);
            this.populateMetrics(menuMetrics);
        }
    }

    public static defineMaxLevelUsage(max: number) {
        MetricController.maxLevelUsage = max;
    }

    private static populateOrientationAndLevelUsage(parent: HTMLElement){
        const orientation = UIController.config.orientation;
        const levelUsage = UIController.config.default_level;

        // Orientation
        let orientationOptions = ["IN", "OUT", "IN_OUT"];
        const select = SubMenuController.createSelect("Orientation", orientation, parent, orientationOptions)

        select.addEventListener("change", () => {
            UIController.config.orientation = select.value as Orientation;
            UIController.updateScene(CriticalLevel.REPARSE_DATA);
        })

        // Level usage
        const range = SubMenuController.createRange("Level usage", levelUsage, 0, MetricController.maxLevelUsage, 1, parent);
        range.addEventListener("change", () => {
            UIController.config.default_level = +range.value;
            UIController.updateScene(CriticalLevel.REPARSE_DATA);
        })
    }

    private static populateApiClasses(parent: HTMLElement){
        const apiClasses = UIController.config.api_classes;
        const inputs = []

        // TODO merge the not ending input with the ending input & make code more readable

        // API classes
        for (let i = 0; i < apiClasses.length; i++) {
            let className = apiClasses[i];
            const input = SubMenuController.createOnlyInputText(className, "ex.package.class", parent);
            inputs.push(input);

            let hasSearchHappened = false;

            input.addEventListener("search", (event) => {
                const isApiAlreadyInList = apiClasses.indexOf(input.value) !== -1;

                if(className !== input.value){
                    if(input.value === ""){
                        apiClasses.splice(apiClasses.indexOf(className), 1);
                        input.parentElement.remove(); // input has a parent div generated with it
                    }else if(!isApiAlreadyInList){
                        apiClasses[i] = input.value;
                        console.log("apiClasses", apiClasses);
                    }else{
                        ToastController.addToast("The class: '" + input.value + "' already exist in the API classes. You can't add it a second time...");
                        input.value = className;
                    }
                    console.log("UIController.config.api_classes: ", UIController.config.api_classes)
                    hasSearchHappened = true;
                    UIController.updateScene(CriticalLevel.REPARSE_DATA);
                }
                className = input.value;
            })
        }

        MetricController.createEmptyClassInput(inputs, apiClasses, parent);
    }

    private static createEmptyClassInput(inputs, apiClasses, parent) {

        // TODO fix issue where when inputting a not null text, it will add a new input box even when it's not at the end of the list

        const input = SubMenuController.createOnlyInputText("", "ex.package.class", parent);
        inputs.push(input);
        let hasSearch = false;

        input.addEventListener("search", (event) => {
            const className = input.value;

            if(hasSearch && className === ""){
                apiClasses.splice(apiClasses.indexOf(className), 1);
                input.parentElement.remove(); // input has a parent div generated with it

            }else if(className !== ""){
                apiClasses.push(className);
                MetricController.createEmptyClassInput(inputs, apiClasses, parent);
                UIController.updateScene(CriticalLevel.REPARSE_DATA);
                hasSearch = true;
            }
        })
    }

    private static populateVariables(parent: HTMLElement){
        const variables = UIController.config.variables;
        const metrics = UIController.config.metrics;

        // Variables
        const noneVal = " -- None -- ";
        const metricNames = [...UIController.config.metrics.keys()];

        Object.keys(variables).forEach(variable => {
            const metricRef = variables[variable];
            const valSelected = metrics.has(metricRef) ? metricRef : noneVal;
            const select = SubMenuController.createSelect(variable, valSelected, parent, metricNames, "--None--");

            select.addEventListener("change", (event) => {
                variables[variable] = select.value === noneVal ? "" : select.value;
                UIController.updateScene(CriticalLevel.RERENDER_SCENE);
            })
        })
    }

    private static populateMetrics(parent: HTMLElement){
        const metrics = UIController.config.metrics;

    }

}
