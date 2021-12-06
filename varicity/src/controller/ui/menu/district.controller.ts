import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import {SubMenuInterface} from "./sub-menu.interface";

export class DistrictController implements SubMenuInterface {

    defineSubMenuTitle(): string {
        return "Districts";
    }

    public createMenu(parent: HTMLElement) {
        const menuPadding = SubMenuController.createMenu("Padding", true, parent);
        const menuFaceColors = SubMenuController.createMenu("Faces Color", true, parent);

        if (UIController.config) {

            // Fetch the attributes
            let padding = UIController.config.district.padding;
            let colors = UIController.config.district.colors;

            // Padding
            let paddingSelector = SubMenuController.createRange("Padding", padding, 0, 2, 0.1, menuPadding);

            paddingSelector.addEventListener("change", () => {
                UIController.config.district.padding = +paddingSelector.value;
                console.log(UIController.config.district.padding)
                UIController.updateScene(CriticalLevel.RERENDER_SCENE);
            })

            // Face Colors
            colors.faces.forEach(color => {
                let colorPicker = SubMenuController.createColorSelector(color.name, color.color, menuFaceColors);

                colorPicker.addEventListener("change", (ke) => {
                    color.color = colorPicker.value
                    UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
                });
            })
        }
    }
}
