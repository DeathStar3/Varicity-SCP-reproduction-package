import { District } from '../entities/district.interface';
import { ClassImplem } from './classImplem.model';
import {MetricObject} from "./metricObject.model";

export class Metrics {

    metrics: Map<string, MetricObject>;

    constructor() {
        this.metrics = new Map<string, MetricObject>();
    }


    addMetric(metric: MetricObject) {
        return this.metrics.set(metric.name, metric);
    }

    // returns if obj is a child of this
    hasMetric(metricName: string): boolean {
        return this.metrics.has(metricName);
    }

    getMetricValue(metricName: string): number {
        if(!this.hasMetric(metricName)){
            return 0;
        }

        const value = this.metrics.get(metricName).value;
        return value === undefined ? 0 : value;
    }
}

export const includedVariabilityMetrics = new Set();
includedVariabilityMetrics.add("nbConstructorVariants");
includedVariabilityMetrics.add("nbMethodVariants");
