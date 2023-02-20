import {Building} from "./building.interface";

export abstract class Link {
    target: Building;
    source: Building;
    type: string;
    percentage?: number;

    protected constructor() {
    }
}
