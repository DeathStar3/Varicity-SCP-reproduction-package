import {UIController} from "../ui.controller";
import {SubMenuController} from "./sub-menu.controller";
import {CriticalLevel} from "../../../model/entitiesImplems/config.model";

export class LinkController {

    public static createMenu() {
        const parent = SubMenuController.getParentContentSubMenu();

        // set title
        SubMenuController.changeTitleSubMenuElement("Links");


        const menuColor = SubMenuController.createMenu("Colors", true, parent);
        const displayMenu = SubMenuController.createMenu("Display", true, parent);
        const hierarchyMenu = SubMenuController.createMenu("Hierarchy links", true, parent);

        if (UIController.config) {

            // fetch the links
            const links = UIController.config.link;

            // colors
            links.colors.forEach(color => {
                let colorPicker = SubMenuController.createColorSelector(color.name, color.color, menuColor);

                colorPicker.addEventListener("change", (ke) => {
                    color.color = colorPicker.value
                    UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
                });
            })

            // Air traffic and Underground Road
            const airTraffic = links.display.air_traffic;
            const undergroundRoads = links.display.underground_road;
            SubMenuController.createDoubleText("Air Traffic", "Underground Road", displayMenu);

            this.radioBoxListener(SubMenuController.createCustomRadioBox("IMPLEMENTS", airTraffic.includes('IMPLEMENTS'), undergroundRoads.includes('IMPLEMENTS'), displayMenu), 'IMPLEMENTS');
            this.radioBoxListener(SubMenuController.createCustomRadioBox("EXTENDS", airTraffic.includes('EXTENDS'), undergroundRoads.includes('EXTENDS'), displayMenu), 'EXTENDS');
            this.radioBoxListener(SubMenuController.createCustomRadioBox("USAGE", airTraffic.includes('USAGE'), undergroundRoads.includes('USAGE'), displayMenu), 'USAGE');
            this.radioBoxListener(SubMenuController.createCustomRadioBox("DUPLICATE", airTraffic.includes('DUPLICATE'), undergroundRoads.includes('DUPLICATE'), displayMenu), 'DUPLICATE');

            // Hierarchy Links
            const hierarchyLinks = links.display.underground_road;
            hierarchyLinks.forEach(link => {
                SubMenuController.createOnlyInputText(link, "LINK TYPE", hierarchyMenu);
            })
            SubMenuController.createOnlyInputText("", "LINK TYPE", hierarchyMenu);
        }

    }

    private static radioBoxListener(htmlInputElements: HTMLInputElement[], parameter: string) {

        let underground_road = UIController.config.link.display.underground_road;
        let air_traffic = UIController.config.link.display.air_traffic;

        htmlInputElements[0].addEventListener('change', function () {
            if (htmlInputElements[0].checked) {
                air_traffic.push(parameter)
                if (htmlInputElements[1].checked) {
                    htmlInputElements[1].checked = false;
                    underground_road.splice(underground_road.indexOf(parameter), 1)
                }
            } else {
                air_traffic.splice(air_traffic.indexOf(parameter), 1)
            }
            UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
        });

        htmlInputElements[1].addEventListener('change', function () {
            if (htmlInputElements[1].checked) {
                underground_road.push(parameter)
                if (htmlInputElements[0].checked) {
                    htmlInputElements[0].checked = false;
                    air_traffic.splice(air_traffic.indexOf(parameter), 1)
                }
            } else {
                underground_road.splice(underground_road.indexOf(parameter), 1)
            }
            UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
        });
    }

    // TODO implement hierarchy links drag and drop
}
