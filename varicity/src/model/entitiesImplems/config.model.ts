import { Color, ConfigClones, ConfigColor, ConfigInterface, D3Config } from "../entities/config.interface";
import { Orientation } from "./orientation.enum";
import {Vector3} from "@babylonjs/core";

export enum CriticalLevel {
    LOW_IMPACT = 0,
    RERENDER_SCENE = 1,
    REPARSE_DATA = 2
}

export class MetricSpec {
    min: number;
    max: number;
    higherIsBetter: boolean;

    constructor() {
        this.min = 0
        this.max = 100
        this.higherIsBetter = false;
    }
}

export class Config implements ConfigInterface {

    id?:string; //for persistence
    projectId?:string; //for persistence
    description: string;
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
    api_classes: Map<string, string[]>;
    variables: {
        width: string;
        height: string;
    };

    camera_data: CameraData;

    parsing_mode: string;
    orientation: Orientation;
    default_level: number;

    metrics: Map<string, MetricSpec>;

    constructor() { }

    public static instanceOfColor(object: any): object is Color {
        return object &&
            object.name && typeof (object.name) == "string" &&
            object.color && typeof (object.color) == "string";
    }

    public static instanceOfConfigColor(object: any): object is ConfigColor {
        return object &&
            // object.outline && typeof (object.outline) == "string" &&
            object.edges && Array.isArray(object.edges) && object.edges.every((v: any) => this.instanceOfColor(v)) &&
            object.faces && Array.isArray(object.faces) && object.faces.every((v: any) => this.instanceOfColor(v)) &&
            object.outlines && Array.isArray(object.outlines) && object.outlines.every((v: any) => this.instanceOfColor(v));
    }

    public static alterField(config: Config, fields: string[], value: [string, string] | Color): CriticalLevel { // for the tuple : [prev value, cur value]
        let cur = config;
        if (fields.includes("variables")) {
            if (Array.isArray(value)) {
                config.variables[fields[1]] = value[1];
                return CriticalLevel.RERENDER_SCENE;
            }
        }
        if (fields.includes("parsing_mode")) {
            if (Array.isArray(value)) {
                config.parsing_mode = value[1];
                return CriticalLevel.REPARSE_DATA;
            }
        }
        if (fields.includes("orientation")) {
            if (Array.isArray(value)) {
                config.orientation = Orientation[value[1]];
                return CriticalLevel.REPARSE_DATA;
            }
        }
        if (fields.includes("padding")) {
            if (Array.isArray(value)) {
                config[fields[0]].padding = +value[1];
                return CriticalLevel.RERENDER_SCENE;
            }
        }
        if (fields.includes("metrics")) {
            console.log(fields);
            console.log(value);
            if (Array.isArray(value)) {
                if(fields[2] === "higherIsBetter"){
                    config.metrics.get(fields[1])[fields[2]] = (value[1].toLowerCase() === 'true');
                }else{
                    config.metrics.get(fields[1])[fields[2]] = +value[1];
                }
                return CriticalLevel.RERENDER_SCENE;
            }
        }
        if (fields.includes("camera_data")){
            if (Array.isArray(value)) {
                if(fields.length == 2){
                    config[fields[0]][fields[1]] = +value[1];
                }else{
                    config[fields[0]][fields[1]][fields[2]]  = +value[1];
                }
                return CriticalLevel.RERENDER_SCENE;
            }
        }
        for (let key of fields) {
            cur = cur[key]; // we go deeper
        }
        if (Array.isArray(cur)) { // cur is an array of values
            if (cur.every(v => Config.instanceOfColor(v)) && Config.instanceOfColor(value)) {
                let obj = cur.find(v => v.name == value.name);
                obj.color = value.color;
                return CriticalLevel.LOW_IMPACT;
            } else { // value is prob a string
                if (cur.some(v => v == value[0])) { // already exists
                    let index = cur.findIndex(v => v == value[0])
                    if (value[1] == "") { // prev value was defined, current wasn't, therefore we delete entry
                        cur.splice(index, 1);
                    }
                    else { // prev and current are defined, therefore we change value
                        cur[index] = value[1];
                    }
                } else { // doesn't exist, so we push the new value
                    cur.push(value[1]);
                }
                if(fields.includes("api_classes") || fields.includes("hierarchy_links")) return CriticalLevel.REPARSE_DATA;
            }
            return CriticalLevel.RERENDER_SCENE;
        }
        if (fields.includes("description")) {
            if (Array.isArray(value)) {
                config.description = value[1];
                return CriticalLevel.LOW_IMPACT;
            }
        }
        return CriticalLevel.RERENDER_SCENE;
    }
}

// TODO move to new file
export class CameraData {
    alpha: number;
    beta: number;
    radius: number;
    target: Vector3_Local;

    constructor(alpha: number, beta: number, radius: number, position: Vector3_Local) {
        this.alpha = alpha;
        this.beta = beta;
        this.radius = radius;
        this.target = position;
    }

}

export class Vector3_Local {
    x: number;
    y: number;
    z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    public static toVector3(v: Vector3_Local): Vector3{
        return new Vector3(v.x, v.y, v.z);
    }
    public static fromVector3(v: Vector3): Vector3_Local{
        return new Vector3_Local(v.x, v.y, v.z);
    }
}
