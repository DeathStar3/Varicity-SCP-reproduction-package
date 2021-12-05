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

            SubMenuController.createCheckBox("IMPLEMENTS", airTraffic.includes('IMPLEMENTS'), airTrafficMenu);
            SubMenuController.createCheckBox("EXTENDS", airTraffic.includes('EXTENDS'), airTrafficMenu);
            SubMenuController.createCheckBox("USAGE", airTraffic.includes('USAGE'), airTrafficMenu);


            // Underground Road
            const undergroundRoads = links.display.underground_road;
            const undergroundRoadMenu = SubMenuController.createSimpleText("Underground Road", displayMenu);
            SubMenuController.createCheckBox("IMPLEMENTS", undergroundRoads.includes('IMPLEMENTS'), undergroundRoadMenu);
            SubMenuController.createCheckBox("EXTENDS", undergroundRoads.includes('EXTENDS'), undergroundRoadMenu);
            SubMenuController.createCheckBox("USAGE", undergroundRoads.includes('USAGE'), undergroundRoadMenu);

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
