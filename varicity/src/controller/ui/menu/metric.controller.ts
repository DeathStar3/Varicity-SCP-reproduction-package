import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {Orientation} from "../../../model/entitiesImplems/orientation.enum";
import {ToastController, ToastType} from "../toast.controller";
import {SearchbarController} from "../searchbar.controller";
import {SubMenuInterface} from "./sub-menu.interface";

export class MetricController implements SubMenuInterface{

    private static maxLevelUsage = 0;

    public defineSubMenuTitle(): string {
        return "Metrics and APIs";
    }

    public createMenu(parent: HTMLElement) {
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

    private populateOrientationAndLevelUsage(parent: HTMLElement){
        // Orientation
        let orientationOptions = ["IN", "OUT", "IN_OUT"];
        const select = SubMenuController.createSelect("Orientation", UIController.config.orientation, parent, orientationOptions)

        select.addEventListener("change", () => {
            UIController.config.orientation = select.value as Orientation;
            UIController.updateScene(CriticalLevel.REPARSE_DATA);
        })

        // Level usage
        const range = SubMenuController.createRange("Level usage", UIController.config.default_level, 0, MetricController.maxLevelUsage, 1, parent);
        range.addEventListener("change", () => {
            UIController.config.default_level = +range.value;
            UIController.updateScene(CriticalLevel.REPARSE_DATA);
        })
    }

    private populateApiClasses(parent: HTMLElement){
        const apiClasses = UIController.config.api_classes;
        const inputs = []

        // API classes
        for (let i = 0; i < apiClasses.length; i++) {
            let className = apiClasses[i];
            this.createClassInput(inputs, apiClasses, parent, className);
        }

        this.createClassInput(inputs, apiClasses, parent);
    }


    private createClassInput(inputs, apiClasses, parent, text?: string) {
        let className = text || "";
        const input = SubMenuController.createOnlyInputText(className, "ex.package.class", parent);

        input.setAttribute("list", "datalist");

        inputs.push(input);

        input.addEventListener("search", (event) => {
            const isInputLastInTheList = inputs.indexOf(input) == inputs.length - 1;
            const isApiAlreadyInList = apiClasses.indexOf(input.value) !== -1;

            // Handle error where the input hasn't change
            if(className === input.value){
                ToastController.addToast("The input hasn't change...", ToastType.INFO);
                return;
            }

            // Handle error where the input already exist in an other input text
            if(isApiAlreadyInList){
                ToastController.addToast("The class: '" + input.value + "' already exist in the API classes. You can't add it a second time...", ToastType.DANGER);
                input.value = className; // reset value to the last one
                return;
            }

            if (!SearchbarController.map.has(input.value)) { // the search key doesn't exist
                input.style.border = "1px solid red";
            }else {
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
                    this.createClassInput(inputs, apiClasses, parent);
                    UIController.updateScene(CriticalLevel.REPARSE_DATA);
                }

                className = input.value;
            }
        })

    }

    private populateVariables(parent: HTMLElement){
        // Variables
        const noneVal = " -- None -- ";
        const metricNames = [...UIController.config.metrics.keys()];

        Object.keys(UIController.config.variables).forEach(variable => {
            const metricRef = UIController.config.variables[variable];
            const valSelected = UIController.config.metrics.has(metricRef) ? metricRef : noneVal;
            const select = SubMenuController.createSelect(variable, valSelected, parent, metricNames, "--None--");

            select.addEventListener("change", (event) => {
                UIController.config.variables[variable] = select.value === noneVal ? "" : select.value;
                UIController.updateScene(CriticalLevel.RERENDER_SCENE);
            })
        })
    }

    private populateMetrics(parent: HTMLElement){
        const metrics = UIController.config.metrics;

        metrics.forEach((metric, name) => {
            const inputs = SubMenuController.createMinMaxSelector(name, metric.min.toString(), metric.max.toString(), metric.higherIsBetter, parent);

            const minInput = inputs[0] as HTMLInputElement;
            const maxInput = inputs[1] as HTMLInputElement;
            const lowerInput = inputs[2];
            const higherInput = inputs[3];

            const selectedClass = "btn-primary";
            const notSelectedClass = "btn-outline-primary";

            minInput.addEventListener("keypress", (event) => {
                if(event.key === 'Enter'){
                    console.log("min changed")
                    let el = UIController.config.metrics.get(name);
                    const newMin = +minInput.value;

                    if(el.max < newMin){
                        ToastController.addToast("The min value '" + newMin + "' of the metric '" + name + "' can't be lower than the max value: " + el.max, ToastType.DANGER);
                        return;
                    }

                    UIController.config.metrics.get(name).min = +minInput.value;
                    UIController.updateScene(CriticalLevel.RERENDER_SCENE);
                }
            })

            maxInput.addEventListener("keypress", (event) => {
                if(event.key === 'Enter') {
                    console.log("max changed")
                    let el = UIController.config.metrics.get(name);
                    const newMax = +maxInput.value;

                    if (el.min > newMax) {
                        ToastController.addToast("The max value '" + newMax + "' of the metric '" + name + "' can't be lower than the min value: " + el.min, ToastType.DANGER);
                        return;
                    }

                    UIController.config.metrics.get(name).max = +maxInput.value;
                    UIController.updateScene(CriticalLevel.RERENDER_SCENE);
                }
            })

            lowerInput.addEventListener('click', function () {
                if(!lowerInput.classList.contains(selectedClass)){
                    lowerInput.classList.add(selectedClass);
                    lowerInput.classList.remove(notSelectedClass);
                    higherInput.classList.add(notSelectedClass);
                    higherInput.classList.remove(selectedClass);

                    UIController.config.metrics.get(name).higherIsBetter = false;
                    UIController.updateScene(CriticalLevel.RERENDER_SCENE); // Reload the screen
                }
            });

            higherInput.addEventListener('click', function () {
                if(!higherInput.classList.contains(selectedClass)){
                    higherInput.classList.add(selectedClass);
                    higherInput.classList.remove(notSelectedClass);
                    lowerInput.classList.add(notSelectedClass);
                    lowerInput.classList.remove(selectedClass);

                    UIController.config.metrics.get(name).higherIsBetter = true;
                    UIController.updateScene(CriticalLevel.RERENDER_SCENE); // Reload the screen
                }
            });
        })
    }
}
