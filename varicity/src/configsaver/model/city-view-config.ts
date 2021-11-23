import { Vector3 } from "@babylonjs/core";

export enum UserType{
    EXPERT=2,
    NEWCOMER=1
}
export class CityViewConfig{
    userType:UserType;
    username:string;
    timestamp:Date;
    projectName:string;
    cameraPosition:Vector3;
}