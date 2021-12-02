import {UIController} from './ui.controller';
import {ConfigName, Vector3_Local} from './../../model/entitiesImplems/config.model';
import Cookies from "js-cookie";
import {Closeable} from "../../model/entities/closeable.interface";
import {ConfigService} from "../../services/config.service";

export class SaveController {

    public static addSaveListeners() {

        document.getElementById("save-btn").addEventListener('click', () => {
            let cameraPos = UIController.scene.camera.getTarget();
            UIController.config.camera_data.target = Vector3_Local.fromVector3(cameraPos);
            UIController.config.camera_data.alpha = UIController.scene.camera["alpha"];
            UIController.config.camera_data.beta = UIController.scene.camera["beta"];
            UIController.config.camera_data.radius = UIController.scene.camera["radius"];
            UIController.createConfig(UIController.config);
        });

        document.querySelector('#save-config').addEventListener('click', _clickev => {

            // Close dialog
            (document.querySelector('#save_content') as unknown as Closeable).close();

            document.querySelector('#dialog').setAttribute('open', 'true');
            console.log('Project Id of the Config is', UIController.config.projectId);

            UIController.config.projectId = Cookies.get('varicity-current-project');
            console.log('Project Id of the Config is now', UIController.config.projectId);

            (document.querySelector('#text-field') as HTMLInputElement).value = UIController.config.name || "";
        });

        document.querySelector('#save-config-confirm-btn').addEventListener('click', _clickev => {


            console.log('Add config ', new Date().toISOString())
            UIController.config.name = (document.querySelector('#text-field') as HTMLInputElement).value;

            console.log("Metrics: ", UIController.config.metrics);
            console.log("Saving config modified", {...UIController.config, metrics: Object.fromEntries(UIController.config.metrics)});

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

            // Close dialog
            (document.querySelector('#dialog') as unknown as Closeable).close();
        })
    }
}
