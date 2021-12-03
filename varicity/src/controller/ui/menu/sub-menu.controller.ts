export class SubMenuController {

    private static indexCounter = 0;

    private static trackMenuOpened = new Map<string, boolean>();

    public static createLongReadonlyText(text: string, value: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText(text, value, "", parent, true, 6, 6)
    }

    public static createShortReadonlyText(text: string, value: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText(text, value, "",  parent, true, 4, 8)
    }

    public static createInput(text: string, value: string, placeholderText: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText(text, value, placeholderText, parent, false, 4, 8)
    }

    public static createOnlyInputText(value: string, placeholderText: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText("", value, placeholderText, parent, false, 0, 12)
    }

    public static createOnlyInputReadonlyText(value: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText("", value, "", parent, true, 0, 12)
    }

    public static createGreyText(text: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText(text, "", "", parent, true, 12, 0)
    }

    public static createText(text: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText("", text, "", parent, true, 0, 12)
    }

    public static createSelect(text: string, defaultValue: string, parent: HTMLElement, options: string[],  firstOption?: string): HTMLSelectElement {
        let divElement = document.createElement("div");
        divElement.classList.add("input-form", "vertical-container", "input-custom");

        let div2Element = document.createElement("div");
        div2Element.classList.add("input-group");

        let labelElement = document.createElement("label");
        labelElement.classList.add("input-group-text", "col-4");
        labelElement.innerHTML = text;

        let selectElement = document.createElement("select");
        selectElement.classList.add("custom-select", "form-select", "col-8");
        selectElement.innerHTML = text;

        if(firstOption){
            let defaultOptionElement = document.createElement("option");
            defaultOptionElement.value = firstOption;
            defaultOptionElement.label = firstOption;
            defaultOptionElement.selected = (firstOption == defaultValue);
            selectElement.appendChild(defaultOptionElement);
        }

        options.forEach(function (option) {
            let optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.label = option;
            optionElement.selected = (option == defaultValue);
            selectElement.appendChild(optionElement);
        });

        divElement.appendChild(div2Element);
        div2Element.appendChild(labelElement);
        div2Element.appendChild(selectElement);
        parent.appendChild(divElement);

        return selectElement;
    }

    public static createMenu(title: string, isOpen: boolean, parent: HTMLElement): HTMLElement {

        const sectionText = document.getElementById("submenu-title").innerHTML;
        const id = sectionText.replace(" ","") + "-" + title.replace(" ","");
        if (this.trackMenuOpened.has(id)){
            isOpen = this.trackMenuOpened.get(id)
        }

        const isExpandedText = (isOpen) ? "true" : "false";
        const collapseGen = "collapse-" + SubMenuController.genIndex();

        let listElement = document.createElement("li");
        listElement.classList.add("menu-container-2");

        let buttonElement = document.createElement("button");
        buttonElement.setAttribute("id", id);
        buttonElement.classList.add("btn", "btn-toggle", "align-items-center", "rounded", "collapsed", "menu-button");
        buttonElement.setAttribute("data-bs-toggle", "collapse");
        buttonElement.setAttribute("data-bs-target", "#" + collapseGen);
        buttonElement.setAttribute("aria-expanded", isExpandedText);
        buttonElement.innerHTML=title;

        buttonElement.addEventListener("click", () => {
            this.trackMenuOpened.set(id, JSON.parse(buttonElement.getAttribute("aria-expanded").toLowerCase()))
        });

        let divElement = document.createElement("div");
        divElement.classList.add("menu-container");
        if(isOpen){
            divElement.classList.add("show");
        }else{
            divElement.classList.add("collapse");
        }
        divElement.id = collapseGen;

        listElement.appendChild(buttonElement);
        listElement.appendChild(divElement);
        parent.appendChild(listElement);
        return divElement;
    }

    public static createRange(text: string, startValue: number, min: number, max: number, step: number, parent: HTMLElement): HTMLElement {
        let formElement = document.createElement("form");
        formElement.classList.add("input-group", "input-custom");

        let spanElement = document.createElement("span");
        spanElement.classList.add("input-group-text", "col-4");
        spanElement.innerHTML = text;

        let divElement = document.createElement("div");
        divElement.classList.add("range-custom", "col-6");

        let inputElement = document.createElement("input");
        inputElement.type = "range";
        inputElement.value = startValue.toString();
        inputElement.min = min.toString();
        inputElement.max = max.toString();
        inputElement.step = step.toString();

        let outputElement = document.createElement("output");
        outputElement.classList.add("input-group-text", "col-2");
        outputElement.innerHTML = startValue.toString();

        inputElement.oninput = (e) => {
            outputElement.value = inputElement.value;
        };

        formElement.appendChild(spanElement);
        formElement.appendChild(divElement);
        divElement.appendChild(inputElement);
        formElement.appendChild(outputElement);
        parent.appendChild(formElement);

        return outputElement;
    }

    public static createColorSelector(text: string, initColor: string, parent: HTMLElement): HTMLInputElement {
        let divElement = document.createElement("div");
        divElement.classList.add("input-group", "input-custom");

        let spanElement = document.createElement("span");
        spanElement.classList.add("input-group-text", "col-6");
        spanElement.innerHTML = text;

        let inputElement = document.createElement("input");
        inputElement.classList.add("form-control", "form-control-color", "color-custom", "col-6");
        inputElement.type="color";
        inputElement.title="Choose your color";
        inputElement.value = initColor.toString();

        divElement.appendChild(spanElement);
        divElement.appendChild(inputElement);
        parent.appendChild(divElement);

        return inputElement;
    }

    public static createCustomText(text: string, value: string, placeholderText: string, parent: HTMLElement, isReadonly:boolean, sizeFirstText: number, sizeValueText: number): HTMLInputElement {
        let divElement = document.createElement("div");
        divElement.classList.add("input-group", "input-custom");

        let spanElement: HTMLSpanElement;
        if(sizeFirstText != 0){
            spanElement = document.createElement("span");
            spanElement.classList.add("input-group-text", "col-" + sizeFirstText);
            spanElement.innerHTML = text;
        }

        let inputElement: HTMLInputElement;
        if(sizeValueText != 0) {
            inputElement = document.createElement("input");
            inputElement.classList.add("form-control", "col-" + sizeValueText);
            inputElement.type = "text";
            inputElement.readOnly = isReadonly;
            inputElement.placeholder = placeholderText;
            inputElement.value = value.toString();
        }
        if(spanElement){ divElement.appendChild(spanElement); }
        if(inputElement){ divElement.appendChild(inputElement); }
        parent.appendChild(divElement);

        return inputElement;
    }

    private static genIndex(): number {
        return ++SubMenuController.indexCounter;
    }

    static createSimpleText(text: string, displayMenu: HTMLElement): HTMLElement { // TODO Improve
        let divElement = document.createElement("div");
        divElement.classList.add("input-custom");
        divElement.innerHTML = text;
        displayMenu.appendChild(divElement);

        return divElement;
    }
}
