import * as ts from "typescript";

export default abstract class SymfinderVisitor{

    abstract visit(node: ts.Node): void;
}