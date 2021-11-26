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
        
        await this.neoGraph.detectVPsAndVariants();
        console.log("Number of VPs: " + await this.neoGraph.getTotalNbVPs());
        console.log("Number of methods VPs: " + await this.neoGraph.getNbMethodVPs());
        console.log("Number of constructor VPs: " + await this.neoGraph.getNbConstructorVPs());
        console.log("Number of method level VPs: " + await this.neoGraph.getNbMethodLevelVPs());
        console.log("Number of class level VPs: " + await this.neoGraph.getNbClassLevelVPs());
        console.log("Number of variants: " + await this.neoGraph.getTotalNbVariants());
        console.log("Number of methods variants: " + await this.neoGraph.getNbMethodVariants());
        console.log("Number of constructors variants: " + await this.neoGraph.getNbConstructorVariants());
        console.log("Number of method level variants: " + await this.neoGraph.getNbMethodLevelVariants());
        console.log("Number of class level variants: " + await this.neoGraph.getNbClassLevelVariants());
        console.log("Number of nodes: " + await this.neoGraph.getNbNodes());
        console.log("Number of relationships: " + await this.neoGraph.getNbRelationships());
        

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