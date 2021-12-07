import {SubMenuInterface} from "./sub-menu.interface";
import {SubMenuController} from "./sub-menu.controller";
import {UIController} from "../ui.controller";
import {Color3, Color4, Scene} from "@babylonjs/core";
import Cookies from "js-cookie";
import {BackgroundColor} from "../../../model/entitiesImplems/config.model";

export class SettingsController implements SubMenuInterface {

    public static LIGHT_COLOR = "#C4C4C4"
    public static DARK_COLOR = "#313335"

    private static BACKGROUND_COLOR_COOKIE_NAME = "varicity_isbackgroundlight";

    defineSubMenuTitle(): string {
        return "Settings";
    }

    createMenu(parent: HTMLElement) {
        const menuColor = SubMenuController.createMenu("Background", true, parent);

        // Uncomment if want to have full control over the canvas background color

        // let colorPicker = SubMenuController.createColorSelector("Color", new Color3(1,1,1).toString(), menuColor);
        // colorPicker.value = UIController.scene.scene.clearColor.toHexString(true);
        //
        // colorPicker.addEventListener("change", (ke) => {
        //     UIController.scene.scene.clearColor = Color4.FromColor3(Color3.FromHexString(colorPicker.value), 1);
        // });

        SettingsController.setBackgroundColorCookieIfDoesntExist();
        const isBackgroundLight = SettingsController.getBackgroundColorCookie() == BackgroundColor.LIGHT;

        const inputs = SubMenuController.createSwitchWithText("Color", "Light", "Dark", isBackgroundLight, menuColor);

        const leftBox = inputs[0];
        const rightBox = inputs[1];

        const selectedClass = "btn-primary";
        const notSelectedClass = "btn-outline-primary";

        leftBox.addEventListener('click', function () {
            if (!leftBox.classList.contains(selectedClass)) {
                leftBox.classList.add(selectedClass);
                leftBox.classList.remove(notSelectedClass);
                rightBox.classList.add(notSelectedClass);
                rightBox.classList.remove(selectedClass);

                SettingsController.changeBackgroundColor(BackgroundColor.LIGHT);
            }
        });

        rightBox.addEventListener('click', function () {
            if (!rightBox.classList.contains(selectedClass)) {
                rightBox.classList.add(selectedClass);
                rightBox.classList.remove(notSelectedClass);
                leftBox.classList.add(notSelectedClass);
                leftBox.classList.remove(selectedClass);

                SettingsController.changeBackgroundColor(BackgroundColor.DARK);
            }
        });
    }

    private static setBackgroundColorCookieIfDoesntExist(){
        if(SettingsController.getBackgroundColorCookie() === undefined){
            SettingsController.changeBackgroundColorCookie(BackgroundColor.DARK);
        }
    }

    public static updateBackgroundColorFromCookie(scene: Scene){
        const backgroundColor = SettingsController.getBackgroundColorCookie();

        if(backgroundColor === undefined){
            SettingsController.changeBackgroundColorCookie(BackgroundColor.DARK);
        }

        if(backgroundColor === BackgroundColor.LIGHT){
            scene.clearColor = Color4.FromColor3(Color3.FromHexString(SettingsController.LIGHT_COLOR), 1);
        }else{
            scene.clearColor = Color4.FromColor3(Color3.FromHexString(SettingsController.DARK_COLOR), 1);
        }
    }

    public static changeBackgroundColor(backgroundColor: BackgroundColor){
        SettingsController.changeBackgroundColorCookie(backgroundColor);
        console.log(backgroundColor)
        if(backgroundColor === BackgroundColor.LIGHT){
            UIController.scene.scene.clearColor = Color4.FromColor3(Color3.FromHexString(SettingsController.LIGHT_COLOR), 1);
        }else{
            UIController.scene.scene.clearColor = Color4.FromColor3(Color3.FromHexString(SettingsController.DARK_COLOR), 1);
        }
    }

    private static changeBackgroundColorCookie(backgroundColor: BackgroundColor){
        Cookies.set(SettingsController.BACKGROUND_COLOR_COOKIE_NAME, backgroundColor, {sameSite: 'strict'});
    }

    private static getBackgroundColorCookie() {
        return Cookies.get(SettingsController.BACKGROUND_COLOR_COOKIE_NAME);
    }
}
