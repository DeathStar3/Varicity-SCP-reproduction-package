import ClassesVisitor from "./visitors/ClassesVisitor"
import SymfinderVisitor from "./visitors/SymfinderVisitor";
import GraphBuilderVisitor from "./visitors/GraphBuilderVisitor";
import StrategyTemplateDecoratorVisitor from "./visitors/StrategyTemplateDecoratorVisitor"
import Parser from "./parser/Parser";
import NeoGraph from "./neograph/NeoGraph";
import { config } from "./configuration/Configuration";
import { join } from "path";
import { readdirSync, statSync } from "fs";
import { EntityAttribut, EntityType, RelationType } from "./neograph/NodeType";
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
        await this.proximityFolderDetection();
        await this.detectCommonEntityProximity();
        await this.detectCommonMethodImplemented();

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

    async proximityFolderDetection(): Promise<void>{

        await this.neoGraph.setProximityFolder();
        var vpFoldersPath: string[] = await this.neoGraph.getAllVPFoldersPath();

        let i = 0;
        let len = vpFoldersPath.length;
        for(let vpFolderPath of vpFoldersPath){
            i++;
            process.stdout.write("\rSearch SUPER variant files: "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+")");
            var variantFilesNameSet: string[] = await this.neoGraph.getVariantFilesNameForVPFolderPath(vpFolderPath);
            var foldersPath: string[] = await this.neoGraph.getFoldersPathForVPFolderPath(vpFolderPath);

            var isSuperVariantFile = true;
            for(let variantFileName of variantFilesNameSet){

                var superVariantFilesNode: Node[] = [];
                for(let folderPath of foldersPath){

                    let currentFile: Node | undefined = await this.neoGraph.getVariantFileForFolderPath(folderPath, variantFileName);
                    if(currentFile === undefined){
                        isSuperVariantFile = false;
                        break;
                    }
                    else superVariantFilesNode.push(currentFile)
                }
                if(isSuperVariantFile){
                    for(let superVariantFileNode of superVariantFilesNode){
                        await this.neoGraph.addLabelToNode(superVariantFileNode, EntityAttribut.SUPER_VARIANT_FILE)
                    }
                }
            }
        }
        if(i > 0)
            process.stdout.write("\rSearch SUPER variant files: "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+"), done.\n");
        await this.detectCodeClone();
    }

    async detectCodeClone(): Promise<void>{
        var nodes: Node[] = await this.neoGraph.getAllVariantFiles();
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
            process.stdout.write("\rCheck duplication code: "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+")");

            var clones: any[] = await detectClones({
                path: value.map((node: Node) => node.properties.path),
                silent: true
            })
            for(let clone of clones){
                var nodeA: Node = value.find((node: Node) => node.properties.path == clone.duplicationA.sourceId);
                var nodeB: Node = value.find((node: Node) => node.properties.path == clone.duplicationB.sourceId);
                var percentA = (((clone.duplicationA.range[1] - clone.duplicationA.range[0]) / readFileSync(nodeA.properties.path, 'utf-8').length) * 100).toFixed(0);
                var percentB = (((clone.duplicationB.range[1] - clone.duplicationB.range[0]) / readFileSync(nodeB.properties.path, 'utf-8').length) * 100).toFixed(0);
                await this.neoGraph.linkTwoNodesWithCodeDuplicated(nodeA, nodeB, RelationType.CODE_DUPLICATED,
                    clone.duplicationA.fragment, percentA, clone.duplicationA.start.line +":"+ clone.duplicationA.end.line);
                await this.neoGraph.linkTwoNodesWithCodeDuplicated(nodeB, nodeA, RelationType.CODE_DUPLICATED,
                    clone.duplicationA.fragment, percentB, clone.duplicationB.start.line +":"+ clone.duplicationB.end.line);
            }            
        }
        if(i > 0)
            process.stdout.write("\rCheck duplication code: "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+"), done.\n");
    }


    async detectCommonEntityProximity(): Promise<void>{

        var vpFoldersPath: string[] = await this.neoGraph.getAllVPFoldersPath();

        let i = 0;
        let len = vpFoldersPath.length;
        for(let vpFolderPath of vpFoldersPath){
            i++;
            process.stdout.write("\rDetect common entities: "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+")");
            var variantFilesNameSet: string[] = await this.neoGraph.getVariantFilesNameForVPFolderPath(vpFolderPath);
            
            for(let variantFileName of variantFilesNameSet){

                var variantFileNodes: Node[] = await this.neoGraph.getVariantFilesForVPFolderPath(vpFolderPath, variantFileName);                
                var entitiesOcc: any[] = [];

                for(let variantFileNode of variantFileNodes){
                    
                    for(let entityNode of await this.neoGraph.getVariantEntityNodeForFileNode(variantFileNode)){
                        if(entitiesOcc[entityNode.properties.name] === undefined){
                            entitiesOcc[entityNode.properties.name] = [entityNode];
                        }
                        else{
                            entitiesOcc[entityNode.properties.name].push(entityNode);
                        }
                    }
                }

                for(let [key, value] of Object.entries(entitiesOcc)){
                    if(value.lenght > 2 && value.length == variantFileNodes.length){
                        for(let entityNode of value){
                            await this.neoGraph.addLabelToNode(entityNode, EntityAttribut.PROXIMITY_ENTITY);
                        }
                    }
                }
            }
        }
        if(i > 0)
            process.stdout.write("\rDetect common entities: "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+"), done.\n");
    }

    async detectCommonMethodImplemented(): Promise<void>{

        var motherEntitiesNode: Node[] = await this.neoGraph.getMotherEntitiesNode();
        let i = 0;
        let len = motherEntitiesNode.length;

        for(let motherEntityNode of motherEntitiesNode){
            i++;
            process.stdout.write("\rDetect common method: "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+")");
            
            var implementedClasses: Node[] = await this.neoGraph.getImplementedClassesFromEntity(motherEntityNode);
            var occurenceMethod: any[] = []
            var motherMethod: string[] = (await this.neoGraph.getMethods(motherEntityNode)).map((n) => n.properties.name);
            for(let implemetedClass of implementedClasses){
                
                var implementedClassMethods = await this.neoGraph.getMethods(implemetedClass);
                for(let implementedClassMethod of implementedClassMethods){
                    if(occurenceMethod[implementedClassMethod.properties.name] === undefined){
                        occurenceMethod[implementedClassMethod.properties.name] = [implementedClassMethod];
                    }
                    else{
                        occurenceMethod[implementedClassMethod.properties.name].push(implementedClassMethod);
                    }
                }
            }
            for(let [key, value] of Object.entries(occurenceMethod)){
                if(value.length > 1 && value.length == implementedClasses.length && !motherMethod.includes(key)){
                    for(let method of value){
                        await this.neoGraph.addLabelToNode(method, EntityAttribut.COMMON_METHOD);
                    }
                }
            }

        }
        if(i > 0)
            process.stdout.write("\rDetect common entities: "+ (((i) / len) * 100).toFixed(0) +"% ("+i+"/"+len+"), done.\n");
    }
}