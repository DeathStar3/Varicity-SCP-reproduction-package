import ClassesVisitor from "./visitors/ClassesVisitor"
import SymfinderVisitor from "./visitors/SymfinderVisitor";
import Parser from "./parser/Parser"

export class Symfinder{

    run(){
        var files = [];
        files.push('../test_project/strategy/index.ts');
        this.visitPackage(files, new ClassesVisitor());
    }

    visitPackage(files: string[], visitor: SymfinderVisitor){
        for(let file of files){
            let parser = new Parser(file);
            parser.accept(visitor);
        }
    }
}