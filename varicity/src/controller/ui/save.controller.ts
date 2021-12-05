import {UIController} from './ui.controller';
import {ConfigName, Vector3_Local} from './../../model/entitiesImplems/config.model';
import Cookies from "js-cookie";
import {Closeable} from "../../model/entities/closeable.interface";
import {ConfigService} from "../../services/config.service";
import {ToastController, ToastType} from "./toast.controller";
import {SceneRenderer} from "../../view/sceneRenderer";

export class SaveController {

    public static addSaveListeners() {

        document.getElementById("update-camera").addEventListener('click', () => {
            if (UIController.config) {
                (document.querySelector('#save_content') as unknown as Closeable).close(); // Close save or update dialog
                this.saveCamera();
                this.updateConfiguration();
            }
        });

        document.getElementById("update-config").addEventListener('click', () => {
            if (UIController.config) {
                (document.querySelector('#save_content') as unknown as Closeable).close(); // Close save or update dialog
                this.updateConfiguration();
            }
        });

        document.querySelector('#save-config').addEventListener('click', _clickev => {

            if (UIController.config) {
                (document.querySelector('#save_content') as unknown as Closeable).close(); // Close save or update dialog

                document.querySelector('#save-dialog').setAttribute('open', 'true');
                UIController.config.projectId = Cookies.get('varicity-current-project');
                (document.querySelector('#text-field-configname') as HTMLInputElement).value = UIController.config.name || "";
            }
        });

        document.querySelector('#save-config-confirm-btn').addEventListener('click', _clickev => {
            const configName = (document.querySelector('#text-field-configname') as HTMLInputElement).value;
            this.saveConfiguration(configName);

            // Close dialog
            (document.querySelector('#save-dialog') as unknown as Closeable).close();
        })
    }

    public static saveCamera() {
        let cameraPos = SceneRenderer.camera.getTarget();
        UIController.config.camera_data.target = Vector3_Local.fromVector3(cameraPos);
        UIController.config.camera_data.alpha = SceneRenderer.camera["alpha"];
        UIController.config.camera_data.beta = SceneRenderer.camera["beta"];
        UIController.config.camera_data.radius = SceneRenderer.camera["radius"];
        UIController.createConfig(UIController.config);
    }

    public static saveConfiguration(configName: string) {
        this.saveCamera()
        UIController.config.name = configName

        console.log("Metrics: ", UIController.config.metrics);
        console.log("Saving config modified", {
            ...UIController.config,
            metrics: Object.fromEntries(UIController.config.metrics)
        });

        //Fetch input text and set it as Config's name
        ConfigService.saveConfig(UIController.config).then((saveResponseConfig) => {
            console.log('Config saved successfully', saveResponseConfig);
            UIController.config = saveResponseConfig.config;
            UIController.configsName.push(new ConfigName(UIController.config.name, saveResponseConfig.filename));
            UIController.configFileName = saveResponseConfig.filename;
            UIController.createConfigSelector(UIController.configsName, UIController.config.projectId);
        }).catch(err => {
            console.log('Cannot save config to database');
            ToastController.addToast("Configuration '" + UIController.config.name + "' could not be saved", ToastType.DANGER);
            console.error(err);
        });
    }

    public static updateConfiguration() {
        ConfigService.updateConfig(UIController.configFileName, UIController.config).then((saveResponseConfig) => {
            console.log('Config updated successfully', saveResponseConfig);
            ToastController.addToast("Configuration '" + UIController.config.name + "' updated successfully", ToastType.SUCESS);
            UIController.config = saveResponseConfig.config;
            UIController.createConfigSelector(UIController.configsName, UIController.config.projectId);
        }).catch(err => {
            console.log('Cannot update config to database');
            ToastController.addToast("Configuration '" + UIController.config.name + "' could not be updated", ToastType.DANGER, true);
            console.error(err);
        });
    }
}
