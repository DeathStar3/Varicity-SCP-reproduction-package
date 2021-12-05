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
            const links = UIController.config.link; // TODO find a better way than getting a static value, pass it in arguments?

            // colors
            links.colors.forEach(color => {
                SubMenuController.createColorSelector(color.name, color.color, menuColor);
            })

            // TODO replace all below with checkboxes

            // Air traffic and Underground Road
            const airTraffic = links.display.air_traffic;
            const undergroundRoads = links.display.underground_road;
            SubMenuController.createDoubleText("Air Traffic", "Underground Road", displayMenu);

            this.radioBoxListener(SubMenuController.createCustomRadioBox("IMPLEMENTS", airTraffic.includes('IMPLEMENTS'), undergroundRoads.includes('IMPLEMENTS'), displayMenu), 'IMPLEMENTS');
            this.radioBoxListener(SubMenuController.createCustomRadioBox("EXTENDS", airTraffic.includes('EXTENDS'), undergroundRoads.includes('EXTENDS'), displayMenu), 'EXTENDS');
            this.radioBoxListener(SubMenuController.createCustomRadioBox("USAGE", airTraffic.includes('USAGE'), undergroundRoads.includes('USAGE'), displayMenu), 'USAGE');
            // this.radioBoxListener(SubMenuController.createCustomRadioBox("DUPLICATE", airTraffic.includes('DUPLICATE'), undergroundRoads.includes('DUPLICATE'), airTrafficMenu), 'DUPLICATE'); //TODO Need to fix this

            // Hierarchy Links
            const hierarchyLinks = links.display.underground_road;
            hierarchyLinks.forEach(link => {
                SubMenuController.createOnlyInputText(link, "LINK TYPE", hierarchyMenu);
            })
            SubMenuController.createOnlyInputText("", "LINK TYPE", hierarchyMenu);
        }

    }

    public static checkBoxListener(checkbox: HTMLInputElement, selector: string, parameter: string) {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                UIController.config.link.display[selector].push(parameter)
            } else {
                UIController.config.link.display[selector].splice(UIController.config.link.display[selector].indexOf(parameter), 1)
            }

            UIController.updateScene(CriticalLevel.LOW_IMPACT);
        });
    }

    private static radioBoxListener(htmlInputElements: HTMLInputElement[], parameter: string) {

        htmlInputElements[0].addEventListener('change', function () {
            if (htmlInputElements[0].checked) {
                UIController.config.link.display.air_traffic.push(parameter)
                if (htmlInputElements[1].checked) {
                    htmlInputElements[1].checked = false;
                    UIController.config.link.display.underground_road.splice(UIController.config.link.display.underground_road.indexOf(parameter), 1)
                }
            } else {
                UIController.config.link.display.air_traffic.splice(UIController.config.link.display.air_traffic.indexOf(parameter), 1)
            }
            UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
        });

        htmlInputElements[1].addEventListener('change', function () {
            if (htmlInputElements[1].checked) {
                UIController.config.link.display.underground_road.push(parameter)
                if (htmlInputElements[0].checked) {
                    htmlInputElements[0].checked = false;
                    UIController.config.link.display.air_traffic.splice(UIController.config.link.display.air_traffic.indexOf(parameter), 1)
                }
            } else {
                UIController.config.link.display.underground_road.splice(UIController.config.link.display.underground_road.indexOf(parameter), 1)
            }
            UIController.updateScene(CriticalLevel.LOW_IMPACT); // Reload the screen
        });
    }

    // TODO listener to update the config
}
