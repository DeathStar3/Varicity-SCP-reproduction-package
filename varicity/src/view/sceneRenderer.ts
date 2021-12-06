import {Config, Vector3_Local} from './../model/entitiesImplems/config.model';
import {ArcRotateCamera, Engine, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {EntitiesList} from "../model/entitiesList";

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
        // this.canvas.style.width = "100%";
        // this.canvas.style.height = "100%";
        this.canvas.id = "gameCanvas";
        document.getElementById("main").appendChild(this.canvas);

        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);

        // this.camera = new ArcRotateCamera("Camera", this.config.camera_data.alpha, this.config.camera_data.beta, this.config.camera_data.radius, Vector3_Local.toVector3(this.config.camera_data.target), this.scene);
        // this.camera.attachControl(this.canvas, true);
        //
        // this.camera.panningSensibility = 10;


        //console.log(" *** Camera position here"+ this.camera.position);
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
        this.entitiesList = entitiesList;

        // this.config = ConfigService.loadDataFile("config");

        // document.getElementById("reset_camera").addEventListener("click", () => {
        //     this.camera.position = Vector3.Zero();
        //     this.camera.radius = 500;
        //     this.camera.alpha = 2 * Math.PI / 3;
        //     this.camera.beta = Math.PI / 3;
        // });

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
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

    abstract rerender(config: Config): SceneRenderer; //{
    // this.config = config;
    // this.scene.dispose();
    // this.engine.dispose();
    // this.engine = new Engine(this.canvas, true);
    // this.scene = new Scene(this.engine);
    // this.buildScene();
    // }

    abstract buildScene(updateCamera: boolean): void;

    abstract render(): void;
}
