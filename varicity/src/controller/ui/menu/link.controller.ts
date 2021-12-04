import {UIController} from "../ui.controller";
import {SubMenuController} from "./sub-menu.controller";

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

            // Air traffic
            const airTraffic = links.display.air_traffic;
            const airTrafficMenu = SubMenuController.createSimpleText("Air Traffic", displayMenu);
            airTraffic.forEach(traffic => {
                SubMenuController.createOnlyInputText(traffic, "LINK TYPE", airTrafficMenu);
            })
            SubMenuController.createOnlyInputText("", "LINK TYPE", airTrafficMenu);

            // Underground Road
            const undergroundRoads = links.display.underground_road;
            const undergroundRoadMenu = SubMenuController.createSimpleText("Underground Road", displayMenu);
            undergroundRoads.forEach(road => {
                SubMenuController.createOnlyInputText(road, "LINK TYPE", undergroundRoadMenu);
            })
            SubMenuController.createOnlyInputText("", "LINK TYPE", undergroundRoadMenu);

            // Hierarchy Links
            const hierarchyLinks = links.display.underground_road;
            hierarchyLinks.forEach(link => {
                SubMenuController.createOnlyInputText(link, "LINK TYPE", hierarchyMenu);
            })
            SubMenuController.createOnlyInputText("", "LINK TYPE", hierarchyMenu);
        }

    }

    // TODO listener to update the config
}
