import {UIController} from './ui.controller';
import {ConfigName, Vector3_Local} from './../../model/entitiesImplems/config.model';
import Cookies from "js-cookie";
import {Closeable} from "../../model/entities/closeable.interface";
import {ConfigService} from "../../services/config.service";

export class SaveController {

    public static addSaveListeners() {

        document.getElementById("update-config").addEventListener('click', () => {
            if (UIController.config) {
                //TODO to implement
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

            this.saveConfiguration((document.querySelector('#text-field-configname') as HTMLInputElement).value);

            // Close dialog
            (document.querySelector('#save-dialog') as unknown as Closeable).close();
        })
    }

    public static saveCamera() {
        let cameraPos = UIController.scene.camera.getTarget();
        UIController.config.camera_data.target = Vector3_Local.fromVector3(cameraPos);
        UIController.config.camera_data.alpha = UIController.scene.camera["alpha"];
        UIController.config.camera_data.beta = UIController.scene.camera["beta"];
        UIController.config.camera_data.radius = UIController.scene.camera["radius"];
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
            UIController.createConfigSelector(UIController.configsName, UIController.config.projectId);
        }).catch(err => {
            console.log('Cannot save config to database');
            console.error(err);
        });
    }

    public static updateConfiguration() {
        this.saveCamera()
        //TODO Missing this part !
        console.log("Configuration updated")
    }
}
