import {DocController} from "../doc.controller";
import {BlacklistController} from "./blacklist.controller";
import {LinkController} from "./link.controller";
import {DetailsController} from "./details.controller";
import {MetricController} from "./metric.controller";
import {DistrictController} from "./district.controller";
import {SubMenuController} from "./sub-menu.controller";
import bootstrap from "../../../../public/scripts/bootstrap.bundle.min.js"

export class MenuController {

    public static selectedTab;

    public static createMenu() {
        this.addListeners("main-menu");
        this.addListeners("tool-menu");
        this.addTooltipListeners();
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
        // clear the sub-menu
        SubMenuController.getParentContentSubMenu().innerHTML = "";

        if (selectedTab) {

            switch (selectedTab.getAttribute("id")) {
                case "information":
                    DetailsController.createMenu();
                    break;
                case "building":

                    break;
                case "districts":
                    DistrictController.createMenu();
                    break;
                case "links":
                    LinkController.createMenu();
                    break;
                case "blacklist":
                    BlacklistController.createMenu();
                    break;
                case "metric-entrypoints":
                    MetricController.createMenu();
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
                document.getElementById("project-config_content").setAttribute('scrimClickAction', 'close');
                document.getElementById("project-config_content").setAttribute('escapeKeyAction', 'close');
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

    public static changeImage(element: Element) {
        const img = element.getElementsByTagName('img').item(0);
        if (!img.getAttribute("src").match("_selected.svg$")) {
            img.setAttribute("src", img.getAttribute("src").replace(".svg", "_selected.svg"));
        } else {
            img.setAttribute("src", img.getAttribute("src").replace("_selected.svg", ".svg"));
        }
        return img;
    }

    private static addTooltipListeners() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl, { trigger: 'hover' });
        })
    }
}
