import {includedVariabilityMetrics, Metrics} from "../../../../model/entitiesImplems/metrics.model";
import {MetricObject} from "../../../../model/entitiesImplems/metricObject.model";
import {NodeInterface} from "../../../../model/entities/jsonInput.interface";

export interface Node {
    name: string;
    types: string[];
    nbAttributes: number;
    nbFunctions: number;
    nbVariants: number;
    nbConstructorVariants: number;
    nbMethodVariants: number;
    metrics: Metrics;
}

export class NodeElement implements Node{
    name: string;
    types: string[];
    nbAttributes: number;
    nbFunctions: number;
    nbVariants: number;
    nbConstructorVariants: number;
    nbMethodVariants: number;
    metrics: Metrics;

    analyzed: boolean;
    root: boolean;
    compositionLevel: number = -1;
    origin: string = "";

    constructor(name: string) {
        this.name = name;
        this.analyzed = false;
        this.root = true;
        this.metrics = new Metrics();
    }

    public fillMetrics(nodeI: NodeInterface){
        let attributes = Object.getOwnPropertyNames(this);
        attributes.forEach(metric => {
            if(includedVariabilityMetrics.has(metric)){
                this.metrics.addMetric(new MetricObject(metric, this[metric]));
            }
        })

        if(nodeI.additionalMetrics !== undefined){
            nodeI.additionalMetrics.forEach(metric => {
                this.metrics.addMetric(new MetricObject(metric.name, metric.value));
            })
        }
        console.log(this.metrics);
    }
}
