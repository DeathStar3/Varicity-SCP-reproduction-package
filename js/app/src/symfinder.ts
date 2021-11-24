import ClassesVisitor from "./visitors/ClassesVisitor"
import SymfinderVisitor from "./visitors/SymfinderVisitor";
import GraphBuilderVisitor from "./visitors/GraphBuilderVisitor";
import StrategyTemplateDecoratorVisitor from "./visitors/StrategyTemplateDecoratorVisitor"
import Parser from "./parser/Parser";
import NeoGraph from "./neograph/NeoGraph";
import { config } from "./configuration/Configuration";
import { glob } from "glob";

export class Symfinder{

    neoGraph: NeoGraph;

    constructor(){
        this.neoGraph = new NeoGraph(config);
    }

    async run(src: string){
        await this.neoGraph.clearNodes();

        console.log("Detect variability in : '" + src + "'")
        var files: string[] = glob.sync(src + "/**/*.ts", {"ignore": [src +"/**/*.spec.ts"]});
        await this.visitPackage(files, new ClassesVisitor(this.neoGraph), "classes");
        await this.visitPackage(files, new GraphBuilderVisitor(this.neoGraph), "relations");
        await this.visitPackage(files, new StrategyTemplateDecoratorVisitor(this.neoGraph), "strategies");
        await this.neoGraph.driver.close();
    }

    async visitPackage(files: string[], visitor: SymfinderVisitor, label: string){
        var nbFiles = files.length;
        var currentFile = 0;
        for(let file of files){
            let parser = new Parser(file);
            await parser.accept(visitor);
            currentFile++;
            process.stdout.write("Resolving "+label+": " + ((100 * currentFile) / nbFiles).toFixed(0) + "% (" + currentFile + "/" + nbFiles + ")" + "\r");
        }
        process.stdout.write("Resolving "+label+": " + ((100 * currentFile) / nbFiles).toFixed(0) + "% (" + currentFile + "/" + nbFiles + ")" + ", done.\n");
    } 
}