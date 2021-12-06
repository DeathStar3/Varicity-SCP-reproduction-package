import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {SubMenuInterface} from "./sub-menu.interface";
import {Color} from "../../../model/entities/config.interface";

export class BuildingController implements SubMenuInterface  {

    defineSubMenuTitle(): string {
        return "Building";
    }

    public createMenu(parent: HTMLElement) {

        const menuPadding = SubMenuController.createMenu("Padding", true, parent);
        const menuFacesColors = SubMenuController.createMenu("Faces Color", true, parent);
        const menuEdgesColors = SubMenuController.createMenu("Edges Color", true, parent);
        const menuOutlinesColors = SubMenuController.createMenu("Outlines Color", true, parent);

        if (UIController.config) {

            // Fetch the attributes
            let padding = UIController.config.building.padding;
            let colorsFaces = UIController.config.building.colors.faces;
            let colorsEdges = UIController.config.building.colors.edges;
            let colorsOutlines = UIController.config.building.colors.outlines;

            // Padding
            let paddingSelector = SubMenuController.createRange("Padding", padding, 0.2, 2, 0.1, menuPadding);

            paddingSelector.addEventListener("change", () => {
                UIController.config.building.padding = +paddingSelector.value;
                console.log(UIController.config.building.padding)
                UIController.updateScene(CriticalLevel.RERENDER_SCENE);
            })

            // Face Colors

            const listOfProperties = ["API", "CLASS", "INTERFACE", "ABSTRACT", "VP", "VARIANT", "HOTSPOT", "STRATEGY", "FACTORY", "TEMPLATE", "DECORATOR", "COMPOSITION_STRATEGY", "METHOD_LEVEL_VP", "DENSE", "PUBLIC", "PRIVATE"]

            if (colorsFaces) {
                colorsFaces.forEach(color => {
                    if (!color.color){ color.color = "#555555"}
                    let colorPicker = SubMenuController.createColorSelector(color.name, color.color, menuFacesColors);

                    colorPicker.addEventListener("change", (ke) => {
                        color.color = colorPicker.value
                        UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
                    });
                })
            }

            if (colorsEdges) {
                colorsEdges.forEach(color => {
                    if (!color.color){ color.color = "#555555"}
                    let colorPicker = SubMenuController.createColorSelector(color.name, color.color, menuEdgesColors);

                    colorPicker.addEventListener("change", (ke) => {
                        color.color = colorPicker.value
                        UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
                    });
                })
            }

            if (colorsOutlines) {
                colorsOutlines.forEach(color => {
                    if (!color.color){ color.color = "#555555"}
                    let colorPicker = SubMenuController.createColorSelector(color.name, color.color, menuOutlinesColors);

                    colorPicker.addEventListener("change", (ke) => {
                        color.color = colorPicker.value
                        UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
                    });
                })
            }
        }
    }
}
