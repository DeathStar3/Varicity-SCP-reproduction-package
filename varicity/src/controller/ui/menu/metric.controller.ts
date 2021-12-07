import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {ToastController, ToastType} from "../toast.controller";
import {SubMenuInterface} from "./sub-menu.interface";

export class MetricController implements SubMenuInterface {

    public defineSubMenuTitle(): string {
        return "Metrics";
    }

    public createMenu(parent: HTMLElement) {
        const menuVariables = SubMenuController.createMenu("Variables", true, parent);
        const menuMetrics = SubMenuController.createMenu("Metrics", true, parent);

        if (UIController.config) {
            this.populateVariables(menuVariables);
            this.populateMetrics(menuMetrics);
        }
    }

    private populateVariables(parent: HTMLElement) {
        // Variables
        const noneVal = " -- None -- ";
        const metricNames = [...UIController.config.metrics.keys()];

        Object.keys(UIController.config.variables).forEach(variable => {
            const metricRef = UIController.config.variables[variable];
            const valSelected = UIController.config.metrics.has(metricRef) ? metricRef : noneVal;
            const select = SubMenuController.createSelect(variable, valSelected, parent, metricNames, noneVal);

            select.addEventListener("change", (event) => {
                UIController.config.variables[variable] = select.value === noneVal ? "" : select.value;
                UIController.updateScene(CriticalLevel.RERENDER_SCENE);
            })
        })
    }

    private populateMetrics(parent: HTMLElement) {
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
                if (event.key === 'Enter') {
                    console.log("min changed")
                    let el = UIController.config.metrics.get(name);
                    const newMin = +minInput.value;

                    if (el.max < newMin) {
                        ToastController.addToast("The min value '" + newMin + "' of the metric '" + name + "' can't be lower than the max value: " + el.max, ToastType.DANGER);
                        return;
                    }

                    UIController.config.metrics.get(name).min = +minInput.value;
                    UIController.updateScene(CriticalLevel.RERENDER_SCENE);
                }
            })

            maxInput.addEventListener("keypress", (event) => {
                if (event.key === 'Enter') {
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
                if (!lowerInput.classList.contains(selectedClass)) {
                    lowerInput.classList.add(selectedClass);
                    lowerInput.classList.remove(notSelectedClass);
                    higherInput.classList.add(notSelectedClass);
                    higherInput.classList.remove(selectedClass);

                    UIController.config.metrics.get(name).higherIsBetter = false;
                    UIController.updateScene(CriticalLevel.RERENDER_SCENE); // Reload the screen
                }
            });

            higherInput.addEventListener('click', function () {
                if (!higherInput.classList.contains(selectedClass)) {
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
