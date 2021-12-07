// @ts-ignore
import Factory from "../../../../public/images/documentation/Factory.png"
// @ts-ignore
import Strategy from "../../../../public/images/documentation/Strategy.png"
// @ts-ignore
import Template from "../../../../public/images/documentation/Template.png"
// @ts-ignore
import Decorator from "../../../../public/images/documentation/Decorator.png"
import {SubMenuInterface} from "./sub-menu.interface";

export class DocController implements SubMenuInterface {

    createMenu(parent: HTMLElement) {
        const docElement = document.getElementById("doc_content");
        docElement.style.display = "block";

        (document.getElementById("factory_img") as HTMLImageElement).src = Factory;
        (document.getElementById("strategy_img") as HTMLImageElement).src = Strategy;
        (document.getElementById("template_img") as HTMLImageElement).src = Template;
        (document.getElementById("decorator_img") as HTMLImageElement).src = Decorator;

        docElement.setAttribute('open', 'true');
    }

    defineSubMenuTitle(): string {
        return "Documentation";
    }
}
