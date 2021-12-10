import axios, {AxiosResponse} from 'axios';
import {backendUrl} from '../constants';
import {Config, ConfigName, MetricSpec, SaveResponseConfig} from '../model/entitiesImplems/config.model';

export class ConfigService {

    /**
     * Get the names of all configs from the specified project
     * @param projectName
     */
    public static loadConfigNames(projectName: string): Promise<AxiosResponse<ConfigName[], any>> {
        return axios.get<ConfigName[]>(`${backendUrl}/projects/${projectName}/configs/filenames-and-names`);
    }

    /**
     * Get the most recent config for the specified project
     * If the project doesn't have any config it receives a default one
     * @param projectName
     */
    public static async loadDataFile(projectName: string): Promise<Config> {
        return ConfigService.loadConfig(axios.get<Config>(`${backendUrl}/projects/configs/firstOrDefault?name=${projectName}`));
    }

    /**
     * Get a specific config from its name and the project name
     * @param projectName
     * @param configName
     */
    public static async loadConfigFromName(projectName: string, configName: string): Promise<Config> {
        return ConfigService.loadConfig(axios.get<Config>(`${backendUrl}/projects/${projectName}/configs?configName=${configName}`));
    }

    /**
     * Save the config in backend filesystem
     * @param config saved in backend
     * @return the return value is a config with a filename attribute
     */
    public static async saveConfig(config: Config): Promise<SaveResponseConfig> {
        return new Promise<SaveResponseConfig>((resolve, reject) => {
            axios.post<SaveResponseConfig>(`${backendUrl}/projects/configs`, {
                ...config,
                metrics: Object.fromEntries(config.metrics)
            }).then((res) => {
                let saveResponseConfig = res.data;
                ConfigService.convertMetricJsObjectToMap(saveResponseConfig.config);
                resolve(saveResponseConfig);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Update the config in backend filesystem
     * @param config saved in backend
     * @param fileName file to update
     * @return the return value is a config with a filename attribute
     */
    public static async updateConfig(fileName: string, config: Config): Promise<SaveResponseConfig> {

        if (!fileName) { fileName = "default"}

        return new Promise<SaveResponseConfig>((resolve, reject) => {
            axios.post<SaveResponseConfig>(`${backendUrl}/projects/configs/` + fileName, {
                ...config,
                metrics: Object.fromEntries(config.metrics)
            }).then((res) => {
                let saveResponseConfig = res.data;
                ConfigService.convertMetricJsObjectToMap(saveResponseConfig.config);
                resolve(saveResponseConfig);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    /**
     * Middleware for Axios config calls to convert the metric js object to a map
     * @param promise of the config
     * @private
     */
    private static async loadConfig(promise: Promise<AxiosResponse<Config, any>>): Promise<Config> {
        return new Promise<Config>((resolve, reject) => {
            promise.then((res) => {
                let config = res.data;
                ConfigService.convertMetricJsObjectToMap(config);
                resolve(config);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * When the map is deserialized from axios, its not an new Map, but a simple js object
     * This method convert the metrics js object to a real map
     * @param config
     * @private
     */
    private static convertMetricJsObjectToMap(config: Config) {
        if (config.metrics === undefined) {
            config.metrics = new Map<string, MetricSpec>();
        } else if (!(config.metrics instanceof Map)) {
            config.metrics = new Map(Object.entries(config.metrics));
        }
    }
}
