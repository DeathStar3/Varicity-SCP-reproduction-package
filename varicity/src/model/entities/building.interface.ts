import {Node, NodeElement} from './../../controller/parser/symfinder_elements/nodes/node.element';
import {Metrics} from "../entitiesImplems/metrics.model";
import { Color3 } from "@babylonjs/core";

export abstract class Building implements Node {
    name: string;
    types: string[];
    nbAttributes: number;
    nbFunctions: number;
    nbVariants: number;
    nbConstructorVariants: number;
    nbMethodVariants: number;
    metrics: Metrics;

    width: number;
    height: number;

    compLevel: number;

    exportedClasses: Node[];

    force_color: Color3 = undefined;

    constructor() {
        this.types = [];
    }

    abstract getHeight(field: string): number;

    abstract getWidth(field: string): number;


}
