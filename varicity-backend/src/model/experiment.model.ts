import { stringify } from "querystring";

export class ExperimentResult {
    projectName: string;
    symfinderResult: SymfinderResult;
    externalMetric: Map<string, Node[]>;

}

export class SymfinderResult {
    vpJsonGraph: string;
    statisticJson: string;
}
