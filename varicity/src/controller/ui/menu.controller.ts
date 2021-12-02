import {NodeElement} from "../parser/symfinder_elements/nodes/node.element";

export class MenuController {

    static selectedTab;

    public static createMenu() {
        this.addListeners("main-menu");
        this.addListeners("tool-menu");
    }

    public static addListeners(listId: string) {

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
            }
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