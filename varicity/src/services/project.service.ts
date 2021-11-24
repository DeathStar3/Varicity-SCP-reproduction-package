import axios from "axios";
import { backendUrl } from "../constants";


export class ProjectService{


    static async findAllProjectsName(){
      return  axios.get(`${backendUrl}/projects`);
    }
}