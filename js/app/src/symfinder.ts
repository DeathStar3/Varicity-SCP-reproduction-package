import ClassesVisitor from "./visitors/ClassesVisitor"
import SymfinderVisitor from "./visitors/SymfinderVisitor";
import GraphBuilderVisitor from "./visitors/GraphBuilderVisitor";
import Parser from "./parser/Parser";
import NeoGraph from "./neograph/NeoGraph";
import { config } from "./configuration/Configuration";
import * as glob from "glob";

export class Symfinder{

    neoGraph: NeoGraph;

    constructor(){
        this.neoGraph = new NeoGraph(config);
    }

    async run(src: string){
        await this.neoGraph.clearNodes();
        var files = [];
        await glob(src + "/**/*.ts", async (er: any, files: string[]) => {
            console.log("########## SEARCH CLASSES ##########");
            await this.visitPackage(files, new ClassesVisitor(this.neoGraph));
            console.log("########## SEARCH RELATIONS ##########");
            await this.visitPackage(files, new GraphBuilderVisitor(this.neoGraph));
            console.log("########## DONE ##########");
        })        
    }

    async visitPackage(files: string[], visitor: SymfinderVisitor){
        for(let file of files){
            let parser = new Parser(file);
            await parser.accept(visitor);
        }
    }
}