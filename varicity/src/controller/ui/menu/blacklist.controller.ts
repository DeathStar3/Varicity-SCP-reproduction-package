import {SubMenuController} from "./sub-menu.controller";

export class BlacklistController {

    public static createMenu() {
        const parent = document.getElementById("submenu-content") as HTMLElement;

        // set title
        const title = document.getElementById("submenu-title") as HTMLElement;
        title.innerHTML = "Blacklist";

        const menu = SubMenuController.createMenu("Menu", false, parent);
        SubMenuController.createCustomText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu, false, 0, 12);
        SubMenuController.createShortReadonlyText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu)
        SubMenuController.createLongReadonlyText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu)
        SubMenuController.createInput("NbconstructorVariant", "", "placeholder", menu)
        SubMenuController.createSelect("crack", "val 3", menu, "firstValue", ["val 1", "val 2", "val 3", "val 4"])

        const menu2 = SubMenuController.createMenu("Menu", true, parent);
        SubMenuController.createCustomText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu2, false, 0, 12);
        SubMenuController.createShortReadonlyText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu2)
        SubMenuController.createLongReadonlyText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu2)
        SubMenuController.createInput("NbconstructorVariant", "", "placeholder", menu2)
        SubMenuController.createColorSelector("Building Color", "#1072bf", menu2)
        SubMenuController.createSelect("crack", "val 3", menu2, "firstValue", ["val 1", "val 2", "val 3", "val 4"])
        SubMenuController.createRange("Range", 2, 0, 10, 0.5, menu2);
    }
}
