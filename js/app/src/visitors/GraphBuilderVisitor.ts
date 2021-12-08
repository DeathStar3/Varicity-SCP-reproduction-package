import SymfinderVisitor from "./SymfinderVisitor";
import { EntityType, EntityAttribut, RelationType } from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import { ExportDeclaration, ExportSpecifier, HeritageClause, ImportClause, ImportDeclaration, ImportSpecifier, isExportDeclaration, isExportSpecifier, isHeritageClause, isImportClause, isImportDeclaration, isImportSpecifier, Node, SyntaxKind } from "typescript";
import { join } from 'path'
import { filname_from_filepath } from '../utils/path' 
export default class GraphBuilderVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    async visit(node: HeritageClause): Promise<void>;
    async visit(node: ImportDeclaration): Promise<void>;
    async visit(node: ExportSpecifier): Promise<void>;

    /**
     * Visit heritage clause
     * @param node AST node
     * @returns ...
     */
    async visit(node: HeritageClause | ImportDeclaration | ExportSpecifier): Promise<void> {

        if(isHeritageClause(node)) await this.visitHeritageClause(node);
        else if(isImportDeclaration(node)) await this.visitImportDeclaration(node);
        else if(isExportSpecifier(node)) await this.visitExportSpecifier(node);
        return;        
    }

    async visitHeritageClause(node: HeritageClause): Promise<void>{
        
        if(node.parent.name === undefined) return;
        var className: string = node.parent.name?.getText();
        var classType: EntityType; 
        var superClassesName: string[] = node.types.map((type) => type.expression.getText());
        var superClasseType: EntityType;
        var relationType: RelationType;
        var fileName = node.getSourceFile().fileName;

        if(node.parent.kind == SyntaxKind.InterfaceDeclaration)
            classType = EntityType.INTERFACE;
        else if(node.parent.kind == SyntaxKind.ClassDeclaration)
            classType = EntityType.CLASS;
        else {
            console.log("Unknown EntityType "+node.parent.kind+"...");
            return;
        }

        if(node.token == SyntaxKind.ImplementsKeyword){
            superClasseType = EntityType.INTERFACE;
            relationType = RelationType.IMPLEMENTS;
        }
        else if(node.token == SyntaxKind.ExtendsKeyword){
            superClasseType = EntityType.CLASS;
            relationType = RelationType.EXTENDS;
        }
        else {
            console.log("Unknown RelationType "+node.parent.kind+"...");
            return;
        }

        for(let scn of superClassesName){
                var superClassNode = await this.neoGraph.getOrCreateNode(scn, superClasseType, [EntityAttribut.OUT_OF_SCOPE], []);
                if(superClassNode !== undefined){
                    var classNode = await this.neoGraph.getNodeWithFile(className, fileName)
                    if(classNode !== undefined)
                        await this.neoGraph.linkTwoNodes(superClassNode, classNode, relationType);
                    else 
                        console.log("Error to link nodes "+className+" and "+superClassesName+"...");
                }
                else
                    console.log("Error to link nodes "+className+" and "+superClassesName+"...");                
        };
        return;
    }


    async visitImportDeclaration(node: ImportDeclaration): Promise<void>{
        
        var filePath = node.getSourceFile().fileName;
        var fileName = filname_from_filepath(filePath);
        var importedFileName: string;
        var importedFilePath: string;
        var importedModule = (<any>node.moduleSpecifier).text;
        var fileNode = await this.neoGraph.getNodeWithPath(fileName, filePath);
        if(fileNode === undefined){
            console.log("Cannot find file : '" + filePath + "' in graph...");
            return;
        }

        if(importedModule.startsWith('.') || importedModule.startsWith('..')){
            importedFileName = importedModule.split('/').slice(-1)[0] + '.ts';
            importedFilePath = join(filePath.split('/').slice(0, -1).join('/'),importedModule + '.ts');
        }
        else{
            importedFileName = importedModule;
            importedFilePath = "";
        }

        

        var importedFileNode = await this.neoGraph.getOrCreateNodeWithPath(importedFileName, importedFilePath, EntityType.FILE, [EntityAttribut.OUT_OF_SCOPE], []);
        if(importedFileNode !== undefined)
            await this.neoGraph.linkTwoNodes(fileNode, importedFileNode, RelationType.LOAD);
        else
            console.log("Error to link nodes "+filePath+" and "+importedFilePath+" cannot get imported file path node...");

        var importSpecifiers = (<any>node.importClause?.namedBindings)?.elements
        if(importSpecifiers !== undefined){
            for(let child of importSpecifiers){
                if(isImportSpecifier(child)){
                    var importedElementName: string = child.propertyName !== undefined ? child.propertyName.getText() : child.name.getText();
                    var importedElementNode = await this.neoGraph.getNodeWithFile(importedElementName, importedFilePath);
                    
                    if(importedElementNode !== undefined)
                        await this.neoGraph.linkTwoNodes(fileNode, importedElementNode, RelationType.IMPORT);
                }
                
            }
        }
        else if(node.importClause?.name !== undefined){
            var importedElementName = node.importClause.getText();
            var importedElementNode = await this.neoGraph.getNodeWithFile(importedElementName, importedFilePath);
            if(importedElementNode !== undefined){
                await this.neoGraph.linkTwoNodes(fileNode, importedElementNode, RelationType.IMPORT);
            }
        }
    }

    async visitExportSpecifier(node: ExportSpecifier): Promise<void>{
        
        var filePath = node.getSourceFile().fileName;
        var fileName = filname_from_filepath(filePath);
        var exportedElementName = node.getText();

        var exportedElementNode = await this.neoGraph.getNodeWithFile(exportedElementName, filePath);
        if(exportedElementNode !== undefined){
            var fileNode = await this.neoGraph.getNodeWithPath(fileName, filePath);
            if(fileNode !== undefined){
                await this.neoGraph.updateLinkTwoNode(fileNode, exportedElementNode, RelationType.INTERNAL, RelationType.EXPORT);
            }
            else
                console.log("Error to find nodes "+fileName+" to link with "+exportedElementName+"...");
        }
    }
}