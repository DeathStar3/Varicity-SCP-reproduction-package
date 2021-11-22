import SymfinderVisitor from "../visitors/SymfinderVisitor";
import * as ts from 'typescript';
import * as fs from 'fs';

export default class Parser{

    sourceFile: ts.SourceFile;
    
    constructor(file: string) {
        this.sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    }

    accept(visitor: SymfinderVisitor): void{
        this.sourceFile.forEachChild(node => {
            this.visit(node, visitor);
            visitor.visit(node);
        });
    }

    visit(node: ts.Node, visitor: SymfinderVisitor){
        node.forEachChild((child) => {
            this.visit(child, visitor);
            visitor.visit(child);
        })
    }
}