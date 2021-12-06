import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {SubMenuInterface} from "./sub-menu.interface";

export class BuildingController implements SubMenuInterface  {

    defineSubMenuTitle(): string {
        return "Building";
    }

    public createMenu(parent: HTMLElement) {

        const menuPadding = SubMenuController.createMenu("Padding", true, parent);
        const menuFacesColors = SubMenuController.createMenu("Faces Color", true, parent);
        const menuEdgesColors = SubMenuController.createMenu("Edges Color", true, parent);
        const menuOutlinesColors = SubMenuController.createMenu("Outliles Color", true, parent);

        if (UIController.config) {

            // Fetch the attributes
            let padding = UIController.config.building.padding;
            let colorsFaces = UIController.config.building.colors.faces;
            let colorsEdges = UIController.config.building.colors;
            let colorsOutlines = UIController.config.building.colors;

            // Padding
            let paddingSelector = SubMenuController.createRange("Padding", padding, 0.2, 2, 0.1, menuPadding);

            paddingSelector.addEventListener("change", () => {
                UIController.config.building.padding = +paddingSelector.value;
                console.log(UIController.config.building.padding)
                UIController.updateScene(CriticalLevel.RERENDER_SCENE);
            })

            // Face Colors
            //TODO need to implement Face, Edge and Outlines colors
        }
    }
}
