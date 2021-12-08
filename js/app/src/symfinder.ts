import ClassesVisitor from "./visitors/ClassesVisitor"
import SymfinderVisitor from "./visitors/SymfinderVisitor";
import GraphBuilderVisitor from "./visitors/GraphBuilderVisitor";
import StrategyTemplateDecoratorVisitor from "./visitors/StrategyTemplateDecoratorVisitor"
import Parser from "./parser/Parser";
import NeoGraph from "./neograph/NeoGraph";
import { config } from "./configuration/Configuration";
import { join } from "path";
import { readdirSync, statSync } from "fs";
import { EntityType, RelationType } from "./neograph/NodeType";
import { Node } from "neo4j-driver-core";
import { detectClones } from "jscpd";
import { readFileSync } from "fs";


export class Symfinder{

    neoGraph: NeoGraph;

    constructor(){
        this.neoGraph = new NeoGraph(config);
    }

    async run(src: string){
        await this.neoGraph.clearNodes();

        console.log("Analyse variability in : '" + src + "'")

        var files: string[] = await this.visitAllFiles(src);
        process.stdout.write("\rDetecting files ("+files.length+"): done.\x1b[K\n");
        await this.visitPackage(files, new ClassesVisitor(this.neoGraph), "classes");
        await this.visitPackage(files, new GraphBuilderVisitor(this.neoGraph), "relations");
        await this.visitPackage(files, new StrategyTemplateDecoratorVisitor(this.neoGraph), "strategies");
        
        await this.neoGraph.detectVPsAndVariants();
        await this.detectCodeClone();

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
            process.stdout.write("\rResolving "+label+": " + ((100 * currentFile) / nbFiles).toFixed(0) + "% (" + currentFile + "/" + nbFiles + ")");
        }
        process.stdout.write("\rResolving "+label+": " + ((100 * currentFile) / nbFiles).toFixed(0) + "% (" + currentFile + "/" + nbFiles + ")" + ", done.\n");
    }

    async visitAllFiles(path: string): Promise<string[]>{
        var folderName = path.split('/').pop();
        if(folderName === undefined) return [];
        await this.neoGraph.createNodeWithPath(folderName, path, EntityType.DIRECTORY, []);
        return await this.visitFiles(path, []);
    }

    async visitFiles(path: string, files: string[]): Promise<string[]>{

        var parentFolderName = path.split('/').slice(-1)[0];
        if(parentFolderName === undefined) return files;
        var parentNode = await this.neoGraph.getNodeWithPath(parentFolderName, path);
        if(parentNode === undefined) return files;

        for(let fileName of readdirSync(path)){
            const absolute_path = join(path, fileName);
            if (statSync(absolute_path).isDirectory()){
                var folderNode: Node = await this.neoGraph.createNodeWithPath(fileName, absolute_path, EntityType.DIRECTORY, []);
                await this.neoGraph.linkTwoNodes(<Node>parentNode, folderNode, RelationType.CHILD);
                var newFiles = await this.visitFiles(absolute_path, files);
                files.concat(newFiles);
            }
            else{
                if(fileName.endsWith(".ts") && !fileName.endsWith(".test.ts") && !fileName.endsWith("Test.ts") && !fileName.endsWith(".spec.ts") && !fileName.endsWith(".d.ts")){
                    process.stdout.write("\rDetecting files ("+files.length+"): '"+fileName + "'\x1b[K");
                    files.push(absolute_path);
                    var fileNode = await this.neoGraph.createNodeWithPath(fileName, absolute_path, EntityType.FILE, []);
                    await this.neoGraph.linkTwoNodes(<Node>parentNode, fileNode, RelationType.CHILD)  
                }
            }
        }
        return files;
    }

    async detectCodeClone(): Promise<void>{
        var nodes: Node[] = await this.neoGraph.getVariantFiles();
        var groupedNode: any[] = [];
        for(let node of nodes){
            if(groupedNode[node.properties.name] === undefined){
                groupedNode[node.properties.name] = [node]
            }
            else{
                groupedNode[node.properties.name].push(node)
            }
        }
        let i = 0;
        let len = Object.entries(groupedNode).length
        for(let [key, value] of Object.entries(groupedNode)){
            i++;
            process.stdout.write("\rCheck duplication code : "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+")");

            var clones: any[] = await detectClones({
                path: value.map((node: Node) => node.properties.path),
                silent: true
            })
            for(let clone of clones){
                var node1: Node = value.find((node: Node) => node.properties.path == clone.duplicationA.sourceId);
                var node2: Node = value.find((node: Node) => node.properties.path == clone.duplicationB.sourceId);
                var data = readFileSync(node2.properties.path, 'utf-8');
                var percent = (((clone.duplicationB.range[1] - clone.duplicationB.range[0]) / data.length) * 100).toFixed(0);
                await this.neoGraph.linkTwoNodesWithCodeDuplicated(node1, node2, RelationType.CODE_DUPLICATED, clone.duplicationA.fragment, percent);
            }            
        }
        if(i > 0)
            process.stdout.write("\rCheck duplication code : "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+")\n");

        
    }
}