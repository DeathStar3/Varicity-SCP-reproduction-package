import SymfinderVisitor from "../visitors/SymfinderVisitor";
import * as ts from 'typescript';
import * as fs from 'fs';

export default class Parser{

    sourceFile: ts.SourceFile;
    
    constructor(file: string) {
        this.sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest);
    }

    accept(visitor: SymfinderVisitor): void{
        this.sourceFile.forEachChild(node => {
            visitor.visit(node)
        });
    }
}