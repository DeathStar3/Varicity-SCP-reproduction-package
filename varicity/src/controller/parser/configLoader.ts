import axios, { AxiosResponse } from 'axios';
import { backendUrl } from '../../constants';
import {Config, ConfigName, MetricSpec} from '../../model/entitiesImplems/config.model';

export class ConfigLoader {

    public static loadConfigFromPath(configPath: string): Promise<AxiosResponse<Config,any>>  {
        return axios.get<Config>(`${backendUrl}/projects/configs/path?configPath=${configPath}`);
    }

    public static loadDataFile(fileName: string): Promise<AxiosResponse<Config,any>> {
       return axios.get<Config>(`${backendUrl}/projects/configs/firstOrDefault?name=${fileName}`);
    }

    public static loadConfigFiles(fileName: string): Promise<AxiosResponse<Config[],any>>  {
        return axios.get<Config[]>(`${backendUrl}/projects/configs?name=${fileName}`);
    }

    public static loadConfigNames(fileName: string): Promise<AxiosResponse<ConfigName[],any>>  {
        return axios.get<ConfigName[]>(`${backendUrl}/projects/${fileName}/configs/filenames-and-names`);
    }

    static async loadConfigFromName(projectName: string, configName: string): Promise<AxiosResponse<Config,any>> {
        return axios.get<Config>(`${backendUrl}/projects/${projectName}/configs?configName=${configName}`);
    }

    static async loadConfig(promise: Promise<AxiosResponse<Config,any>>): Promise<Config> {
        return new Promise<Config>((resolve, reject) => {
            promise.then((res) => {
                let config = res.data;
                console.log("LOADING CONFIG", config);
                if(config.metrics === undefined){
                    config.metrics = new Map<string, MetricSpec>();
                }else if(!(config.metrics instanceof Map)){
                    config.metrics =  new Map(Object.entries(config.metrics));
                }

                resolve(config);
            });
        });
    }

}
