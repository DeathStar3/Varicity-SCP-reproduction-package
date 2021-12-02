import axios, { AxiosResponse } from 'axios';
import { backendUrl } from '../../constants';
import {Config, ConfigName, MetricSpec, SaveResponseConfig} from '../../model/entitiesImplems/config.model';
import {UIController} from "../ui/ui.controller";

export class ConfigLoader {

    public static loadConfigNames(fileName: string): Promise<AxiosResponse<ConfigName[],any>>  {
        return axios.get<ConfigName[]>(`${backendUrl}/projects/${fileName}/configs/filenames-and-names`);
    }

    public static async loadDataFile(fileName: string): Promise<Config> {
        return ConfigLoader.loadConfig(axios.get<Config>(`${backendUrl}/projects/configs/firstOrDefault?name=${fileName}`));
    }

    public static async loadConfigFromName(projectName: string, configName: string): Promise<Config> {
        return ConfigLoader.loadConfig(axios.get<Config>(`${backendUrl}/projects/${projectName}/configs?configName=${configName}`));
    }

    /**
     * Save the config in backend filesystem
     * @param config saved in backend
     * @return the return value is a config with a filename attribute
     */
    public static async saveConfig(config: Config): Promise<SaveResponseConfig> {
        return new Promise<SaveResponseConfig>((resolve, reject) => {
            axios.post<SaveResponseConfig>(`${backendUrl}/projects/configs`, {...config, metrics: Object.fromEntries(config.metrics)}).then((res) => {
                let saveResponseConfig = res.data;
                ConfigLoader.convertMetricJsObjectToMap(saveResponseConfig.config);
                resolve(saveResponseConfig);
            })
        });
    }

    /**
     * Middleware for Axios config calls to convert the metric js object to a map
     * @param promise of the config
     * @private
     */
    private static async loadConfig(promise: Promise<AxiosResponse<Config,any>>): Promise<Config> {
        return new Promise<Config>((resolve, reject) => {
            promise.then((res) => {
                let config = res.data;
                ConfigLoader.convertMetricJsObjectToMap(config);
                resolve(config);
            });
        });
    }

    private static convertMetricJsObjectToMap(config: Config){
        if(config.metrics === undefined){
            config.metrics = new Map<string, MetricSpec>();
        }else if(!(config.metrics instanceof Map)){
            config.metrics =  new Map(Object.entries(config.metrics));
        }
    }
}
