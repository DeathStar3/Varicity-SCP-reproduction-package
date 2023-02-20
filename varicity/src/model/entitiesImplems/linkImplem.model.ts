import {Link} from "../entities/link.interface";
import {Building} from "../entities/building.interface";

export class LinkImplem extends Link {
    constructor(source: Building, target: Building, type: string, percentage?: number) {
        super();
        this.source = source;
        this.target = target;
        this.type = type;
        this.percentage = percentage;
    }
}