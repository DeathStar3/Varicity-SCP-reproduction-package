import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";

export class BlacklistController {

    public static createMenu() {
        const parent = SubMenuController.getParentContentSubMenu();
        SubMenuController.changeTitleSubMenuElement("Blacklist");

        const menuBlacklist = SubMenuController.createMenu("Blacklist", true, parent);

        if (UIController.config) {

            // fetch the links
            const blacklist = UIController.config.blacklist; // TODO find a better way than getting a static value, pass it in arguments?

            // Blacklisted class
            blacklist.forEach(className => {
                SubMenuController.createOnlyInputText(className, "ex.package.class", menuBlacklist);
            })
            SubMenuController.createOnlyInputText("", "ex.package.class", menuBlacklist);
        }
    }
}
