import axios, { AxiosResponse } from 'axios';
import { backendUrl } from '../../constants';
import { Config } from '../../model/entitiesImplems/config.model';

export class ConfigLoader {
  
    public static loadDataFile(fileName: string): Promise<AxiosResponse<Config,any>> {
       return  axios.get<Config>(`${backendUrl}/projects/configs/firstOrDefault?name=${fileName}`);
    }

    public static loadConfigFiles(fileName: string): Promise<AxiosResponse<Config[],any>>  {
        return  axios.get<Config[]>(`${backendUrl}/projects/configs?name=${fileName}`);
    }
}
