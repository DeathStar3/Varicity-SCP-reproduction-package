export class LinkElement {
    public source: string;
    public target: string;
    public type: string;
    public percentage?: number;

    constructor(source: string, target: string, type: string, percentage?: number) {
        this.source = source;
        this.target = target;
        this.type = type;
        this.percentage = percentage;
        // console.log("percentage INSIDE LINK ELEMENT : ", percentage)
    }
}