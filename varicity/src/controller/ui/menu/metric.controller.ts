import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {Orientation} from "../../../model/entitiesImplems/orientation.enum";

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

        // API classes
        apiClasses.forEach(className => {
            SubMenuController.createOnlyInputText(className, "ex.package.class", parent);
        })
        SubMenuController.createOnlyInputText("", "ex.package.class", parent);
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

    public static defineMaxLevelUsage(max: number) {
        MetricController.maxLevelUsage = max;
    }
}
