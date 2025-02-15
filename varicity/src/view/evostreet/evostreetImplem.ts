import {ArcRotateCamera, Scene, Vector3} from "@babylonjs/core";
import {City3D} from "./3Delements/city3D";
import {SceneRenderer} from "../sceneRenderer";
import {Config, Vector3_Local} from "../../model/entitiesImplems/config.model";
import {SettingsController} from "../../controller/ui/menu/settings.controller";

export class EvostreetImplem extends SceneRenderer {

    buildScene(updateCamera?: boolean) {

        this.scene = new Scene(this.engine);
        SettingsController.updateBackgroundColorFromCookie(this.scene);
        if (!updateCamera) {
            SceneRenderer.camera = new ArcRotateCamera("Camera", SceneRenderer.camera["alpha"], SceneRenderer.camera["beta"], SceneRenderer.camera["radius"], Vector3_Local.toVector3(SceneRenderer.camera.getTarget()), this.scene);
        } else {
            SceneRenderer.camera = new ArcRotateCamera("Camera", this.config.camera_data.alpha, this.config.camera_data.beta, this.config.camera_data.radius, Vector3_Local.toVector3(this.config.camera_data.target), this.scene);
        }
        this.setupCamera(100, 50)
        this.setupLight("light1", new Vector3(0, 1, 0))

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
