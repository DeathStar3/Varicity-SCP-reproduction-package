import * as ts from "typescript";
import NeoGraph from "../neograph/NeoGraph";

export default abstract class SymfinderVisitor{
    
    neoGraph: NeoGraph;

    constructor(neoGraph: NeoGraph){
        this.neoGraph = neoGraph;
    }

    abstract visit(node: ts.Node): void;
}