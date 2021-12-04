import {ArcRotateCamera, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import {City3D} from "./3Delements/city3D";
import {SceneRenderer} from "../sceneRenderer";
import {Config, Vector3_Local} from "../../model/entitiesImplems/config.model";


export class EvostreetImplem extends SceneRenderer {

    buildScene() {
        this.scene = new Scene(this.engine);
        this.camera = new ArcRotateCamera("Camera", this.config.camera_data.alpha, this.config.camera_data.beta, this.config.camera_data.radius, Vector3_Local.toVector3(this.config.camera_data.target), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.panningSensibility = 100;
        this.camera.wheelPrecision = 50;
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

        this.render();
        document.getElementById("loading-frame").style.display = 'none';
    }

    rerender(config: Config): EvostreetImplem {
        this.dispose();
        return new EvostreetImplem(config, this.entitiesList);
    }

    render() {
        const city = new City3D(this.config, this.scene, this.entitiesList);
        city.build();
        city.place();
        city.render();
    }
}
