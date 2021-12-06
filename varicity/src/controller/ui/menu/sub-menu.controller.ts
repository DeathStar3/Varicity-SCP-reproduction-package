import bootstrap from "../../../../public/scripts/bootstrap.bundle.min.js"

export class SubMenuController {

    private static indexCounter = 0;

    private static trackMenuOpened = new Map<string, boolean>();

    public static getParentContentSubMenu(): HTMLElement {
        return document.getElementById("submenu-content") as HTMLElement;
    }

    public static changeTitleSubMenuElement(title: string) {
        (document.getElementById("submenu-title") as HTMLElement).innerText = title;
    }

    public static createLongReadonlyText(text: string, value: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText(text, value, "", parent, true, 6, 6)
    }

    public static createShortReadonlyText(text: string, value: string, parent: HTMLElement): HTMLInputElement {
        return SubMenuController.createCustomText(text, value, "", parent, true, 4, 8)
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

    public static createIconDisplaySVG(text: string, icons: string[], parent: HTMLElement): HTMLElement {
        let formElement = document.createElement("form");
        formElement.classList.add("input-group", "input-custom");

        let spanElement = document.createElement("span");
        spanElement.classList.add("input-group-text", "col-4");
        spanElement.innerHTML = text;

        let divElement = document.createElement("div");
        divElement.classList.add("range-custom", "col-8");
        // divElement.style.overflowX = "auto";

        formElement.appendChild(spanElement);
        formElement.appendChild(divElement);
        icons.forEach(path => {
            let inputElement = document.createElement("img");
            inputElement.src = path;
            inputElement.width = 32;
            inputElement.style.padding = "0 2px"
            inputElement.setAttribute("title", path.match("[^\/]*.svg$")[0].replace(".svg", ""))
            inputElement.setAttribute("data-bs-toggle", "tooltip")
            inputElement.setAttribute("data-bs-placement", "bottom")
            divElement.appendChild(inputElement);
            new bootstrap.Tooltip(inputElement, {trigger: 'hover'});
        });

        parent.appendChild(formElement);

        return divElement;
    }

    public static createSelect(text: string, defaultValue: string, parent: HTMLElement, options: string[], firstOption?: string): HTMLSelectElement {
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

        if (firstOption) {
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
        const id = sectionText.replace(" ", "") + "-" + title.replace(" ", "");
        if (this.trackMenuOpened.has(id)) {
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
        buttonElement.innerHTML = title;

        buttonElement.addEventListener("click", () => {
            this.trackMenuOpened.set(id, JSON.parse(buttonElement.getAttribute("aria-expanded").toLowerCase()))
        });

        let divElement = document.createElement("div");
        divElement.classList.add("menu-container");
        if (isOpen) {
            divElement.classList.add("show");
        } else {
            divElement.classList.add("collapse");
        }
        divElement.id = collapseGen;

        listElement.appendChild(buttonElement);
        listElement.appendChild(divElement);
        parent.appendChild(listElement);
        return divElement;
    }

    public static createRange(text: string, startValue: number, min: number, max: number, step: number, parent: HTMLElement): HTMLInputElement {
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

        return inputElement;
    }

    public static createColorSelector(text: string, initColor: string, parent: HTMLElement): HTMLInputElement {
        let divElement = document.createElement("div");
        divElement.classList.add("input-group", "input-custom");

        let spanElement = document.createElement("span");
        spanElement.classList.add("input-group-text", "col-6");
        spanElement.innerHTML = text;

        let inputElement = document.createElement("input");
        inputElement.classList.add("form-control", "form-control-color", "color-custom", "col-6");
        inputElement.type = "color";
        inputElement.title = "Choose your color";
        inputElement.value = initColor.toString();

        divElement.appendChild(spanElement);
        divElement.appendChild(inputElement);
        parent.appendChild(divElement);

        return inputElement;
    }

    public static createCheckBox(value: string, isChecked: boolean, parent: HTMLElement): HTMLInputElement {
        let divElement = document.createElement("div");
        divElement.classList.add("input-group", "input-custom");

        let checkboxDivElement = document.createElement("div");
        checkboxDivElement.classList.add("input-group-text", "col-1");

        let inputElement: HTMLInputElement;
        inputElement = document.createElement("input");
        inputElement.classList.add("form-check-input");
        inputElement.type = "checkbox";
        inputElement.checked = isChecked;

        checkboxDivElement.appendChild(inputElement)

        let labelElement: HTMLLabelElement;
        labelElement = document.createElement("label");
        labelElement.classList.add("form-control", "form-check-label", "col-11");
        labelElement.innerHTML = value.toString();

        if (checkboxDivElement) {
            divElement.appendChild(checkboxDivElement);
        }
        if (labelElement) {
            divElement.appendChild(labelElement);
        }
        parent.appendChild(divElement);

        return inputElement;
    }

    public static createCustomRadioBox(value: string, isLeftChecked: boolean, isRightChecked: boolean, parent: HTMLElement): HTMLInputElement[] {

        if (isLeftChecked && isRightChecked) {
            isRightChecked = false;
        }

        let divElement = document.createElement("div");
        divElement.classList.add("input-group", "input-custom");

        let checkboxLeftDivElement = document.createElement("div");
        checkboxLeftDivElement.classList.add("input-group-text", "col-1");

        let inputLeftElement: HTMLInputElement;
        inputLeftElement = document.createElement("input");
        inputLeftElement.classList.add("form-check-input");
        inputLeftElement.type = "checkbox";
        inputLeftElement.checked = isLeftChecked;

        checkboxLeftDivElement.appendChild(inputLeftElement)

        let checkboxRightDivElement = document.createElement("div");
        checkboxRightDivElement.classList.add("input-group-text", "col-1");

        let inputRightElement: HTMLInputElement;
        inputRightElement = document.createElement("input");
        inputRightElement.classList.add("form-check-input");
        inputRightElement.type = "checkbox";
        inputRightElement.checked = isRightChecked;

        checkboxRightDivElement.appendChild(inputRightElement)


        let labelElement: HTMLLabelElement;
        labelElement = document.createElement("label");
        labelElement.classList.add("form-control", "form-check-label", "col-10");
        labelElement.innerHTML = value.toString();
        labelElement.style.textAlign = "center"

        if (checkboxLeftDivElement) {
            divElement.appendChild(checkboxLeftDivElement);
        }
        if (labelElement) {
            divElement.appendChild(labelElement);
        }
        if (checkboxRightDivElement) {
            divElement.appendChild(checkboxRightDivElement);
        }
        parent.appendChild(divElement);

        return [inputLeftElement, inputRightElement];
    }

    public static createCustomText(text: string, value: string, placeholderText: string, parent: HTMLElement, isReadonly: boolean, sizeFirstText: number, sizeValueText: number): HTMLInputElement {
        let divElement = document.createElement("div");
        divElement.classList.add("input-group", "input-custom");

        let spanElement: HTMLSpanElement;
        if (sizeFirstText != 0) {
            spanElement = document.createElement("span");
            spanElement.classList.add("input-group-text", "col-" + sizeFirstText);
            spanElement.innerHTML = text;
        }

        let inputElement: HTMLInputElement;
        if (sizeValueText != 0) {
            inputElement = document.createElement("input");
            inputElement.classList.add("form-control", "col-" + sizeValueText);
            inputElement.type = "search";
            inputElement.readOnly = isReadonly;
            inputElement.placeholder = placeholderText;
            inputElement.value = value.toString();
        }
        if (spanElement) {
            divElement.appendChild(spanElement);
        }
        if (inputElement) {
            divElement.appendChild(inputElement);
        }
        parent.appendChild(divElement);

        return inputElement;
    }

    private static genIndex(): number {
        return ++SubMenuController.indexCounter;
    }

    public static createSimpleText(text: string, displayMenu: HTMLElement): HTMLElement {
        let divElement = document.createElement("div");
        divElement.style.fontWeight = "600"
        divElement.classList.add("input-custom");
        divElement.innerHTML = text;
        displayMenu.appendChild(divElement);

        return divElement;
    }

    public static createDoubleText(textLeft: string, textRight: string, displayMenu: HTMLElement): HTMLElement {
        let divMaster = document.createElement("div");
        divMaster.classList.add("d-flex", "justify-content-between")
        divMaster.style.fontWeight = "600"

        let divElementLeft = document.createElement("div");
        divElementLeft.classList.add("input-custom");
        divElementLeft.innerHTML = textLeft;

        let divElementRight = document.createElement("div");
        divElementRight.classList.add("input-custom");
        divElementRight.innerHTML = textRight;

        divMaster.appendChild(divElementLeft);
        divMaster.appendChild(divElementRight);

        displayMenu.appendChild(divMaster);

        return divMaster;
    }

    public static createMinMaxSelector(name: string, min: string, max: string, isHighBetter: boolean, parent: HTMLElement): HTMLElement[] {
        // MAIN CONTAINERS
        let divMaster = document.createElement("div");
        divMaster.style.paddingBottom = "1em";

        let divTitle = document.createElement("div");
        divTitle.style.fontWeight = "600";
        divTitle.style.paddingBottom = "0.2em";
        divTitle.innerText = name;

        let divContainer = document.createElement("div");
        divContainer.classList.add("d-flex", "pr-3");

        divMaster.appendChild(divTitle);
        divMaster.appendChild(divContainer);

        // MIN
        let divMinContainer = document.createElement("div");
        divMinContainer.classList.add("col-3");
        divMinContainer.style.paddingRight = "1em";

        let divMinText = document.createElement("div");
        divMinText.classList.add("input-group", "fill-height");

        let labelMin = document.createElement("label");
        labelMin.classList.add("col-6", "input-group-text");
        labelMin.innerText = "Min";

        let inputMin = document.createElement("input");
        inputMin.classList.add("col-6", "form-control", "fill-height");
        inputMin.type = "text";
        inputMin.value = min;

        divContainer.appendChild(divMinContainer);
        divMinContainer.appendChild(divMinText);
        divMinText.appendChild(labelMin);
        divMinText.appendChild(inputMin);

        // MAX
        let divMaxContainer = document.createElement("div");
        divMaxContainer.classList.add("col-4");
        divMaxContainer.style.paddingRight = "1em";

        let divMaxText = document.createElement("div");
        divMaxText.classList.add("input-group", "fill-height");

        let labelMax = document.createElement("label");
        labelMax.classList.add("col-6", "input-group-text");
        labelMax.innerText = "Max";

        let inputMax = document.createElement("input");
        inputMax.classList.add("col-6", "form-control", "fill-height");
        inputMax.type = "text";
        inputMax.value = max;

        divContainer.appendChild(divMaxContainer);
        divMaxContainer.appendChild(divMaxText);
        divMaxText.appendChild(labelMax);
        divMaxText.appendChild(inputMax);

        // HIGHER / LOWER  IS BETTER
        let divMinMaxColContainer = document.createElement("div");
        divMinMaxColContainer.classList.add("col-5");

        let divHigherIsBetterContainer = document.createElement("div");
        divHigherIsBetterContainer.classList.add("btn-group");

        let divLowerIsBetter = document.createElement("div");
        divLowerIsBetter.classList.add("btn");
        divLowerIsBetter.innerText = "Lower is Better";

        let divHigherIsBetter = document.createElement("div");
        divHigherIsBetter.classList.add("btn");
        divHigherIsBetter.innerText = "Higher is Better";

        if (isHighBetter) {
            divLowerIsBetter.classList.add("btn-outline-primary");
            divHigherIsBetter.classList.add("btn-primary");
        } else {
            divLowerIsBetter.classList.add("btn-primary");
            divHigherIsBetter.classList.add("btn-outline-primary");
        }

        divContainer.appendChild(divMinMaxColContainer);
        divMinMaxColContainer.appendChild(divHigherIsBetterContainer);
        divHigherIsBetterContainer.appendChild(divLowerIsBetter);
        divHigherIsBetterContainer.appendChild(divHigherIsBetter);

        // `
        //     <div>
        //         <div class="" style="font-weight: 600; padding-bottom: 0.2em">Complexity</div>
        //
        //         <div class="d-flex pr-3">
        //             <div class="col-2 ">
        //                 <div class="input-group " style="padding-right: 1em">
        //                     <label for="azaet" class="input-group-text col-6">min</label>
        //                     <input id="azaet" type="text" class="form-control col-6">
        //                 </div>
        //             </div>
        //
        //
        //             <div class="col-2 ">
        //                 <div class="input-group" style="padding-right: 1em">
        //                     <label for="azaeet" class="input-group-text col-6">max</label>
        //                     <input type="text" id="azaeet" class="form-control ">
        //                 </div>
        //             </div>
        //
        //             <div class="col-8">
        //                 <div  class="input-group btn-group ">
        //                     <div class="btn btn-primary ">higher is better</div>
        //                     <div class="btn btn-outline-secondary">lower is better</div>
        //                 </div>
        //             </div>
        //
        //         </div>
        //     </div>
        // `

        parent.appendChild(divMaster);

        return [inputMin, inputMax, divLowerIsBetter, divHigherIsBetter];
    }
}
