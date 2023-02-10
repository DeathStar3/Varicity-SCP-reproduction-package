import {Config} from '../../model/entitiesImplems/config.model';
import {ArcRotateCamera, Scene, Vector3} from "@babylonjs/core";
import {City3D} from "./3Delements/city3D";
import {SceneRenderer} from "../sceneRenderer";
import {SettingsController} from "../../controller/ui/menu/settings.controller";

export class MetricityImplem extends SceneRenderer {

    buildScene(updateCamera: boolean) {
        this.scene = new Scene(this.engine);
        SettingsController.updateBackgroundColorFromCookie(this.scene);
        if (updateCamera) {
            SceneRenderer.camera = new ArcRotateCamera("Camera", 2 * Math.PI / 3, Math.PI / 3, 1000, Vector3.Zero(), this.scene);
        }
        this.setupCamera(100, 50)
        this.setupLight("light1", new Vector3(0, 1, 0))

        this.render();
        document.getElementById("loading-frame").style.display = 'none';
    }

    rerender(config: Config) {
        this.dispose();
        return new MetricityImplem(config, this.entitiesList);
    }

    render() {
        const city = new City3D(this.config, this.scene, this.entitiesList);
        city.build();
        city.place();
        city.render();
    }
}
