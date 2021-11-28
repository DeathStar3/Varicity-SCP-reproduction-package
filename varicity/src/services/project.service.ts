import axios, { AxiosResponse } from "axios";
import { backendUrl } from "../constants";
import { JsonInputInterface } from "../model/entities/jsonInput.interface";


export class ProjectService{

    public static async findAllProjectsName(){
      return  axios.get(`${backendUrl}/projects/names`);
    }

    public static fetchVisualizationData(projectName: string):  Promise<AxiosResponse<JsonInputInterface, any>> {
      return  axios.get<JsonInputInterface>(`${backendUrl}/projects/json/${projectName}`)
    }
}
