import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";

export class MetricController {

    public static createMenu() {
        const parent = document.getElementById("submenu-content") as HTMLElement;

        // set title
        const title = document.getElementById("submenu-title") as HTMLElement;
        title.innerHTML = "Metrics and APIs";

        const menuOrientation = SubMenuController.createMenu("Orientation and Level usage", true, parent);
        const menuAPIClasses = SubMenuController.createMenu("API classes", true, parent);
        const menuVariables = SubMenuController.createMenu("Variables", true, parent);
        const menuMetrics = SubMenuController.createMenu("Metrics", true, parent);

        if (UIController.config) {

            // fetch the links
            const metrics = UIController.config.metrics;
            const variables = UIController.config.variables;
            const apiClasses = UIController.config.api_classes;
            const orientation = UIController.config.orientation;
            const levelUsage = UIController.config.default_level;

            // orientation and level usage
            let orientationOptions = ["IN", "OUT", "IN_OUT"];
            SubMenuController.createSelect("Orientation", orientation, menuOrientation, orientationOptions)

            let max = 3; // TODO calculate and store somewhere
            SubMenuController.createRange("Level usage", levelUsage, 0, max, 1, menuOrientation);

            // API classes
            apiClasses.forEach(className => {
                SubMenuController.createOnlyInputText(className, "ex.package.class", menuAPIClasses);
            })
            SubMenuController.createOnlyInputText("", "ex.package.class", menuAPIClasses);

            // Variables
            const noneVal = " -- None -- ";
            const metricNames = [...UIController.config.metrics.keys()];

            Object.keys(variables).forEach(variable => {
                const metricRef = variables[variable];
                const valSelected = metrics.has(metricRef) ? metricRef : noneVal;
                const select = SubMenuController.createSelect(variable, valSelected, menuVariables, metricNames, "--None--");

                select.addEventListener("change", (event) => {
                    variables[variable] = select.value === noneVal ? "" : select.value;
                    UIController.updateScene(CriticalLevel.RERENDER_SCENE);
                })
            })

            // Metrics
            // TODO
        }
    }
}
