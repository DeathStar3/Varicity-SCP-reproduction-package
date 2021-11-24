import {CameraData, Config, Vector3_Local} from '../../model/entitiesImplems/config.model';
import {Vector3} from "@babylonjs/core";

export class ConfigLoader {
    private static json: Map<string, Config[]> = undefined;
    private static defaultJsonName = undefined;

    private static loadJson(): void {
        const requireContext = require.context('/config', true, /\.ya?ml$/);

        ConfigLoader.json = new Map<string, Config[]>();
        ConfigLoader.defaultJsonName = "config";

        requireContext.keys().forEach((key) => {
            const config = requireContext(key) as Config;

            if(config.camera_data === undefined){
                config.camera_data = new CameraData(2 * Math.PI / 3, Math.PI / 3, 100, new Vector3_Local());
            }

            // check if config file is for specific project
            const projectName = ConfigLoader.getConfigProjectName(key);
            if (projectName !== undefined) {
                if (ConfigLoader.json.has(projectName)) {
                    ConfigLoader.json.get(projectName).push(config);
                } else {
                    ConfigLoader.json.set(projectName, [config]);
                }

                // check if config file is the default one
            } else if (ConfigLoader.isDefaultProject(key)) {
                ConfigLoader.json.set(ConfigLoader.defaultJsonName, [config]);
            }
        });

        console.log('Loaded yaml files : ', ConfigLoader.json);
    }

    public static loadDataFile(fileName: string): Config {
        if (ConfigLoader.json === undefined) {
            ConfigLoader.loadJson();
        }

        if (ConfigLoader.json.has(fileName)) {
            return ConfigLoader.json.get(fileName)[0];
        } else {
            return ConfigLoader.json.get(ConfigLoader.defaultJsonName)[0];
        }
    }

    public static loadConfigFiles(fileName: string): Config[] {
        if (ConfigLoader.json === undefined) {
            ConfigLoader.loadJson();
        }

        if (ConfigLoader.json.has(fileName)) {
            return ConfigLoader.json.get(fileName);
        } else {
            return ConfigLoader.json.get(ConfigLoader.defaultJsonName);
        }
    }

    private static getConfigProjectName(key: string) {
        const myRegexp = new RegExp("^\\.\\/([a-zA-Z\\-\\_.0-9]+)\\/[a-zA-Z\\-\\_.0-9]+\\.ya?ml$", "g");
        let match = myRegexp.exec(key);
        if (match !== undefined && match != null) {
            return match[1];
        } else {
            return undefined;
        }
    }

    private static isDefaultProject(key: string): boolean {
        const myRegexp = new RegExp("^\\.\\/([a-zA-Z\\-\\_.0-9]+)\\.ya?ml$", "g");
        let match = myRegexp.exec(key);
        return match !== undefined && match != null && match[1] === ConfigLoader.defaultJsonName;
    }
}
