
export enum SymfinderServiceResponseType{
    EXPERIMENT_STARTED="EXPERIMENT_STARTED",
    EXPERIMENT_INVALID="EXPERIMENT_INVALID",
    EXPERIMENT_FAILED="EXPERIMENT_FAILED",
    EXPERIMENT_COMPLETED="EXPERIMENT_COMPLETED"

    //...
}

export class SymfinderServiceResponse{
    type:SymfinderServiceResponseType;
    content:any;
}