import {DocController} from "./doc.controller";

export class MenuController {

    static selectedTab;

    public static createMenu() {
        this.addMainMenuListeners("main-menu");
        this.addToolMenuListeners("tool-menu");
    }

    public static addMainMenuListeners(listId: string) {

        // @ts-ignore
        for (let child of document.getElementById(listId).children) {
            child.onclick = (me) => {
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
            }
        }
    }

    public static addToolMenuListeners(listId: string) {

        // @ts-ignore
        for (let child of document.getElementById(listId).children) {
            child.onclick = (me) => {
                this.displayEmbeddedMenu(child)
            }
        }
    }

    private static createSubMenu(selectedTab: Element) {
        if (selectedTab) {

            switch (selectedTab.getAttribute("id")) {
                case "project-config":

                    break;
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