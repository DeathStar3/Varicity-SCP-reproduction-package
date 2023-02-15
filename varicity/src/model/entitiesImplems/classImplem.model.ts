import {Node} from '../../controller/parser/symfinder_elements/nodes/node.element';
import {Building} from "../entities/building.interface";
import { Color3 } from "@babylonjs/core";

export class ClassImplem extends Building {

    constructor(node: Node, level: number, force_color?: Color3) {
        super();
        Object.assign(this, node);
        this.compLevel = level;
        this.force_color = force_color;
    }

    public getHeight(field: string): number {
        return 0.5 + this.metrics.getMetricValue(field) * 0.5;
    }

    public getWidth(field: string): number {
        return 0.5 + this.metrics.getMetricValue(field) * 0.5;
    }
}
