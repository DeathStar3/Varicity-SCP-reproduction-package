import {Vector3} from "@babylonjs/core";

export enum UserType {
    EXPERT = "EXPERT",
    NEWCOMER = "NEWCOMER"
}

export class CityViewConfig {
    userType: UserType;
    username: string;
    timestamp: Date;
    projectName: string;
    cameraPosition: Vector3;
}

export class User {

    constructor(n: string, u: UserType) {
        this.userType = u;
        this.username = n;
    }

    userType: UserType;
    username: string;
}