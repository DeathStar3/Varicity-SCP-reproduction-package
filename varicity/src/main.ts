import axios from 'axios';
import Cookies from 'js-cookie';
import { backendUrl } from './constants';
import { ConfigLoader } from './controller/parser/configLoader';
import { UIController } from './controller/ui/ui.controller';
import { Vector3_Local } from './model/entitiesImplems/config.model';
import { ProjectService } from './services/project.service';

class Main {



    addEvenListenersToUI() {

        document.getElementById("save-btn").addEventListener('click', () => {
            let cameraPos = UIController.scene.camera.getTarget();
            UIController.config.camera_data.target = Vector3_Local.fromVector3(cameraPos);
            UIController.config.camera_data.alpha = UIController.scene.camera["alpha"];
            UIController.config.camera_data.beta = UIController.scene.camera["beta"];
            UIController.config.camera_data.radius = UIController.scene.camera["radius"];
            UIController.createConfig(UIController.config);
        });

        document.querySelector("#save-config").addEventListener('click', _clickev => {
            console.log('Add config ', new Date().toISOString())

            console.log('Project Id of the Config is', UIController.config.projectId);


            UIController.config.projectId = Cookies.get('varicity-current-project');
            console.log('Project Id of the Config is now', UIController.config.projectId);

            axios.post(`${backendUrl}/projects/configs`, UIController.config).then(response => {
                UIController.config = response.data;

            }).catch(err => {
                console.log('Cannot save config to database');
                console.error(err);
            })
        });

    }

    constructor() {

        document.addEventListener('DOMContentLoaded', async (_ev) => {
            let jsonFiles = (await ProjectService.findAllProjectsName()).data;
            console.log(jsonFiles);
            let configs = (await ConfigLoader.loadConfigFiles("config")).data;



            UIController.initSearchbar();
            UIController.createConfig(configs[0]);
            UIController.createDoc();
            UIController.createProjectSelector(jsonFiles);
            UIController.createConfigSelector(configs, "");
            UIController.createLogs();


            this.addEvenListenersToUI();





        })



    }
}
new Main();
