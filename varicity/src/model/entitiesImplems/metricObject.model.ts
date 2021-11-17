import { District } from '../entities/district.interface';
import { ClassImplem } from './classImplem.model';

export class MetricObject {

    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}
