import axios, { AxiosResponse } from 'axios';
import { backendUrl } from '../../constants';
import { Config } from '../../model/entitiesImplems/config.model';

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

    public static loadConfigNames(fileName: string): Promise<AxiosResponse<string[],any>>  {
        return axios.get<string[]>(`${backendUrl}/projects/configs/names?name=${fileName}`);
    }

    static async loadConfigFromName(projectName: string, configName: string): Promise<AxiosResponse<Config,any>> {
        return axios.get<Config>(`${backendUrl}/projects/${projectName}/configs?configName=${configName}`);
    }
}
