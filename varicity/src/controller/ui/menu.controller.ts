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

                if (this.selectedTab && this.selectedTab !== child){
                    img = this.changeImage(this.selectedTab);
                    this.selectedTab.getElementsByTagName('img').item(0).setAttribute("src", img.getAttribute("src").replace("_selected.svg",".svg"));
                }
                if(this.selectedTab == child){
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
                this.createSubMenu(child)
            }
        }
    }

    private static createSubMenu(selectedTab: Element){
        if (selectedTab){
            switch (selectedTab.getAttribute("id")){
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
                case "save":

                    break;
                case "documentation":
                    DocController.displayDocumentation();
                    break;
                case "settings":

                    break;
            }
        }else{ // All tabs are closed

        }
    }

    private static changeImage(element: Element) {
        var img = element.getElementsByTagName('img').item(0);
        if (!img.getAttribute("src").match("_selected.svg$")) {
            img.setAttribute("src", img.getAttribute("src").replace(".svg", "_selected.svg"));
        } else {
            img.setAttribute("src", img.getAttribute("src").replace("_selected.svg", ".svg"));
        }
        return img;
    }
}