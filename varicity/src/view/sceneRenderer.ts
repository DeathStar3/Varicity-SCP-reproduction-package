import {Config} from '../model/entitiesImplems/config.model';
import {ArcRotateCamera, Engine, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {EntitiesList} from "../model/entitiesList";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {SettingsController} from "../controller/ui/menu/settings.controller";

export abstract class SceneRenderer {

    scene: Scene;
    engine: Engine;
    config: Config;
    static camera: ArcRotateCamera;
    light: HemisphericLight;
    entitiesList: EntitiesList;

    canvas: HTMLCanvasElement;

    constructor(config: Config, entitiesList: EntitiesList) {
        this.config = config;

        // create the canvas html element and attach it to the webpage
        this.canvas = document.createElement("canvas");
        this.canvas.id = "gameCanvas";
        document.getElementById("main").appendChild(this.canvas);

        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        SettingsController.updateBackgroundColorFromCookie(this.scene);
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
        this.entitiesList = entitiesList;

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code == "KeyI") {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show().catch(console.error);
                }
            }
        });

        // run the main render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    dispose(): void {
        this.scene.dispose();
        this.engine.dispose();
        this.canvas.remove();
    }

    abstract rerender(config: Config): SceneRenderer;

    abstract buildScene(updateCamera: boolean): void;

    abstract render(): void;

    protected setupCamera(panningSensibility: number, wheelPrecision: number) {
        SceneRenderer.camera.attachControl(this.canvas, true)
        SceneRenderer.camera.panningSensibility = panningSensibility
        SceneRenderer.camera.wheelPrecision = wheelPrecision
    }

    protected setupLight(name: string, position: Vector3) {
        this.light = new HemisphericLight(name, position, this.scene)
    }
}
