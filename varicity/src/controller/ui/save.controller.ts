import {UIController} from './ui.controller';
import {Vector3_Local} from './../../model/entitiesImplems/config.model';
import Cookies from "js-cookie";
import axios from "axios";
import {backendUrl} from "../../constants";
import {Closeable} from "../../model/entities/closeable.interface";

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
            document.querySelector('#dialog').setAttribute('open', 'true');
            console.log('Project Id of the Config is', UIController.config.projectId);

            UIController.config.projectId = Cookies.get('varicity-current-project');
            console.log('Project Id of the Config is now', UIController.config.projectId);

            (document.querySelector('#text-field') as HTMLInputElement).value = UIController.configName;
        });

        document.querySelector('#save-config-confirm-btn').addEventListener('click', _clickev => {
            console.log('Add config ', new Date().toISOString())
            UIController.configName = (document.querySelector('#text-field') as HTMLInputElement).value;

            console.log("Saving config modified", {...UIController.config, metrics: Object.fromEntries(UIController.config.metrics)});

            //Fetch input text and set it as Config's name
            axios.post(`${backendUrl}/projects/configs`, {...UIController.config, metrics: Object.fromEntries(UIController.config.metrics)}).then((response) => {
                console.log('Config saved successfully', response.data);
                UIController.config = response.data.config;
                UIController.configName = response.data.filename;
                UIController.configsName.push(UIController.configName);
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
