import SymfinderVisitor from "../visitors/SymfinderVisitor";
import * as ts from 'typescript';
import * as fs from 'fs';

export default class Parser{

    sourceFile: ts.SourceFile;
    
    constructor(file: string) {
        this.sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    }

    async accept(visitor: SymfinderVisitor) {
        for(let node of this.sourceFile.statements) {
            await this.visit(node, visitor);
            await visitor.visit(node);
        }
    }

    async visit(node: ts.Node, visitor: SymfinderVisitor){
        for(let child of node.getChildren()){
            await this.visit(child, visitor);
            await visitor.visit(child);
        }
    }
}