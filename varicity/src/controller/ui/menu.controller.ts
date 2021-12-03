import {DocController} from "./doc.controller";
import {SubMenuController} from "./sub-menu.controller";

export class MenuController {

    static selectedTab;

    public static createMenu() {
        this.addListeners("main-menu");
        this.addListeners("tool-menu");

        const menu = SubMenuController.createMenu("Menu", false, document.getElementById('submenu-content'));
        SubMenuController.createCustomText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu, false, 0, 12);
        SubMenuController.createShortReadonlyText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu)
        SubMenuController.createLongReadonlyText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu)
        SubMenuController.createInput("NbconstructorVariant", "", "placeholder", menu)
        SubMenuController.createSelect("crack", "val 3", menu, "firstValue", ["val 1", "val 2", "val 3", "val 4"])

        const menu2 = SubMenuController.createMenu("Menu", true, document.getElementById('submenu-content'));
        SubMenuController.createCustomText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu2, false, 0, 12);
        SubMenuController.createShortReadonlyText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu2)
        SubMenuController.createLongReadonlyText("NbconstructorVariant", "1235676786786 e gergerg erg eger g", "placeholder", menu2)
        SubMenuController.createInput("NbconstructorVariant", "", "placeholder", menu2)
        SubMenuController.createColorSelector("Building Color", "#1072bf", menu2)
        SubMenuController.createSelect("crack", "val 3", menu2, "firstValue", ["val 1", "val 2", "val 3", "val 4"])
        SubMenuController.createRange("Range", 2, 0, 10, 0.5, menu2);
    }

    public static addListeners(listId: string) {

        // @ts-ignore
        for (let child of document.getElementById(listId).children) {
            child.onclick = (me) => {

                if (child.className === "collapsible-button") { // If open the collapsible submenu

                    var img = this.changeImage(child);

                    if (this.selectedTab && this.selectedTab !== child) {
                        img = this.changeImage(this.selectedTab);
                        this.selectedTab.getElementsByTagName('img').item(0).setAttribute("src", img.getAttribute("src").replace("_selected.svg", ".svg"));
                    }
                    if (this.selectedTab == child) {
                        this.selectedTab = undefined;
                    } else {
                        this.selectedTab = child;
                    }
                    this.createSubMenu(this.selectedTab)
                } else { // If open a dialog box
                    this.displayEmbeddedMenu(child)
                }
            }
        }
    }

    private static createSubMenu(selectedTab: Element) {
        if (selectedTab) {

            switch (selectedTab.getAttribute("id")) {
                case "information":

                    break;
                case "building":

                    break;
                case "districts":

                    break;
                case "links":

                    break;
                case "blacklist":

                    break;
                case "metric-entrypoints":

                    break;
            }

            // Display the sub menu
            document.getElementById("submenu").style.display = "block";

        } else { // All tabs are closed
            // Hide the sub menu
            document.getElementById("submenu").style.display = "none";
        }
    }

    private static displayEmbeddedMenu(selectedTab: Element) {
        switch (selectedTab.getAttribute("id")) {
            case "project-config":
                document.getElementById("project-config_content").setAttribute('open', 'true');
                break;
            case "save":
                document.getElementById("save_content").setAttribute('open', 'true');
                break;
            case "documentation":
                DocController.displayDocumentation();
                break;
            case "settings":

                break;
        }
    }

    private static changeImage(element: Element) {
        const img = element.getElementsByTagName('img').item(0);
        if (!img.getAttribute("src").match("_selected.svg$")) {
            img.setAttribute("src", img.getAttribute("src").replace(".svg", "_selected.svg"));
        } else {
            img.setAttribute("src", img.getAttribute("src").replace("_selected.svg", ".svg"));
        }
        return img;
    }
}
