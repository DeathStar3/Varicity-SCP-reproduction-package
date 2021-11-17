import ClassesVisitor from "./visitors/ClassesVisitor"
import SymfinderVisitor from "./visitors/SymfinderVisitor";
import Parser from "./parser/Parser"
import NeoGraph from "./neograph/NeoGraph";
import { config } from "./configuration/Configuration";

export class Symfinder{

    neoGraph: NeoGraph;

    constructor(){
        this.neoGraph = new NeoGraph(config)
    }

    run(){
        var files = [];
        files.push('../test_project/strategy/index.ts');
        this.visitPackage(files, new ClassesVisitor(this.neoGraph));
    }

    visitPackage(files: string[], visitor: SymfinderVisitor){
        for(let file of files){
            let parser = new Parser(file);
            parser.accept(visitor);
        }
    }
}