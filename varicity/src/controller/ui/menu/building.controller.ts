import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";
import Sortable from 'sortablejs';
import {Color} from "../../../model/entities/config.interface";

export class BuildingController {

    public static createMenu() {
        const parent = SubMenuController.getParentContentSubMenu();

        // Set title
        SubMenuController.changeTitleSubMenuElement("Building");

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


            // Colors
            this.createColorPickerDragAndDrop(colorsFaces, menuFacesColors, UIController.config.building.colors.faces);
            this.createColorPickerDragAndDrop(colorsEdges, menuEdgesColors, UIController.config.building.colors.edges);
            // this.createColorPickerDragAndDrop(colorsOutlines, menuOutlinesColors, UIController.config.building.colors.outlines);

        }
    }

    private static createColorPickerDragAndDrop(colorsFaces: Color[], menuFacesColors: HTMLElement, colorList: Color[]) {
        let wrapperFaces = this.createDragAndDrop(colorsFaces, menuFacesColors);

        new Sortable(wrapperFaces, {
            animation: 350,

            // Element dragging ended
            onEnd: function (evt) {
                const oldIndex = evt.oldIndex;  // target list
                const newIndex = evt.newIndex;  // previous list
                if (oldIndex !== newIndex) {
                    let newColor = colorList[oldIndex]

                    let indexTo = newIndex < oldIndex ? newIndex : newIndex + 1
                    colorList.splice(indexTo, 0, newColor);

                    let indexToDelete = indexTo > oldIndex ? oldIndex : oldIndex + 1
                    colorList.splice(indexToDelete, 1)
                    console.log(colorList)
                    UIController.updateScene(CriticalLevel.RERENDER_SCENE);
                }
            },
        });
    }

    private static createDragAndDrop(colorsFaces: Color[], menuFacesColors: HTMLElement) {
        let wrapperFaces = document.createElement("div");
        wrapperFaces.classList.add("wrapper");
        wrapperFaces.id = "wrapper-faces";

        if (colorsFaces) {
            colorsFaces.forEach(color => {
                let item = document.createElement("div");
                item.classList.add("item");

                if (!color.color) {
                    color.color = "#555555"
                }
                let colorPicker = SubMenuController.createColorSelector(color.name, color.color, item);

                colorPicker.addEventListener("change", (ke) => {
                    color.color = colorPicker.value
                    UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
                });
                let i = document.createElement("i");
                i.classList.add("fas", "fa-bars")
                item.appendChild(i);
                wrapperFaces.appendChild(item);
            })
        }
        menuFacesColors.appendChild(wrapperFaces);
        return wrapperFaces;
    }
}
