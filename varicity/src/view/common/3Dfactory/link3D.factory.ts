import {Config} from '../../../model/entitiesImplems/config.model';
import {Scene} from '@babylonjs/core';
import {Building3D} from '../3Delements/building3D';
import {Link3DImplem} from '../3Delements/link3DImplem';
import {UndergroundRoad3DImplem} from '../3Delements/undergroundRoad3DImplem';
import {Link3D} from '../3Dinterfaces/link3D.interface';
import { Bridge3D } from "../3Delements/bridge3D";

export class Link3DFactory {
    public static createLink(src: Building3D, dest: Building3D, type: string, percentage: number, scene: Scene, config: Config): Link3D {
        if (!config.link.display) return undefined;
        if (config.link.display.air_traffic.includes(type)) return new Link3DImplem(src, dest, type, percentage, scene, config);
        if (config.link.display.underground_road.includes(type)) return new UndergroundRoad3DImplem(src, dest, type, scene, config);
        if (config.link.display.bridges.includes(type)) return new Bridge3D(src, dest, type, scene, config);
    }
}