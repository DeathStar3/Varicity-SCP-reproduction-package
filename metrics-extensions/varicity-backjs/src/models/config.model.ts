import { Vector3 } from "./user.model";

export class CameraData {
    alpha: number;
    beta: number;
    radius: number;
    target: Vector3;
}

export enum Orientation {
    IN = "IN",
    OUT = "OUT",
    IN_OUT = "IN_OUT"
}

export interface ConfigClones {
    map: Map<string, {
        original: any,
        clones: any
    }>
}

export interface Color {
    name: string;
    color: string; // HEX COLOR string
}


export interface D3Config {
    padding: number;
    colors: ConfigColor;
}


export interface ConfigColor {
    // colors: {
    edges: Color[], // HEX color string
    faces: Color[],
    outlines: Color[]
    // }
}
export class VaricityConfig {

    id?:string; //for persistence
    name: string;
    projectId?:string; //for persistence
    description: string;
    username:string;
    timestamp:string; //isodate
    building: D3Config;
    // building: ConfigColor;
    // district: ConfigColor;
    district: D3Config;
    link: {
        colors: [Color],
        display: {
            air_traffic: string[],
            underground_road: string[],
        }
    };
    vp_building: {
        color: string; // HEX color string
    };
    hierarchy_links: string[];
    blacklist: string[];
    clones: ConfigClones;
    force_color: string; // HEX color string
    api_classes: string[]; // a list instead of a map
    variables: {
        width: string;
        height: string;
    };
    parsing_mode: string;
    orientation: Orientation;
    default_level: number;

    camera_data: CameraData;
}