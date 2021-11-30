import SymfinderVisitor from "./SymfinderVisitor";
import { EntityType, EntityAttribut, RelationType } from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import { ExportDeclaration, ExportSpecifier, HeritageClause, ImportClause, ImportDeclaration, ImportSpecifier, isExportDeclaration, isExportSpecifier, isHeritageClause, isImportClause, isImportDeclaration, isImportSpecifier, Node, SyntaxKind } from "typescript";
import { join } from 'path'
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
        var moduleName = node.getSourceFile().fileName.replace(/\.[^/.]+$/, "");

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
                    var classNode = await this.neoGraph.getNodeWithModule(className, moduleName)
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
        
        var moduleName = node.getSourceFile().fileName.replace(/\.[^/.]+$/, "");
        var importedModuleName: string = (<any>node.moduleSpecifier).text
        var path = moduleName.split('/').slice(0, -1).join('/');

        //detect out_of_scope modules
        if(importedModuleName.startsWith('.') || importedModuleName.startsWith('..'))
            importedModuleName = join(path, importedModuleName)

        var importedModuleNode = await this.neoGraph.getOrCreateNode(importedModuleName, EntityType.MODULE, [EntityAttribut.OUT_OF_SCOPE], []);
        if(importedModuleNode !== undefined){
            var moduleNode = await this.neoGraph.getNodeWithType(moduleName, EntityType.MODULE)
            if(moduleNode !== undefined)
                await this.neoGraph.linkTwoNodes(moduleNode, importedModuleNode, RelationType.LOAD);
            else 
                console.log("Error to link nodes "+moduleName+" and "+importedModuleName+"...");
        }
        else
            console.log("Error to link nodes "+moduleName+" and "+importedModuleName+"...");

        var importSpecifiers = node.importClause?.namedBindings?.getChildren();
        if(importSpecifiers !== undefined){
            for(let child of importSpecifiers){
                
                if(isImportSpecifier(child)){
                    var importedElementName: string = child.propertyName !== undefined ? child.propertyName.getText() : child.name.getText();
                    var importedElementNode = await this.neoGraph.getNodeWithModule(importedElementName, importedModuleName);
                    if(importedElementNode !== undefined){
                        var moduleNode = await this.neoGraph.getNode(moduleName);
                        if(moduleNode !== undefined){
                            await this.neoGraph.linkTwoNodes(moduleNode, importedElementNode, RelationType.IMPORT);
                        }
                        else
                            console.log("Error to find nodes "+moduleName+" to link with "+importedElementName+"...");
                    }
                }
                
            }
        }
        else if(node.importClause?.name !== undefined){
            var importedElementName = node.importClause.getText();
                var importedElementNode = await this.neoGraph.getNodeWithModule(importedElementName, importedModuleName);
                if(importedElementNode !== undefined){
                    var moduleNode = await this.neoGraph.getNode(moduleName);
                    if(moduleNode !== undefined){
                        await this.neoGraph.linkTwoNodes(moduleNode, importedElementNode, RelationType.IMPORT);
                    }
                    else
                        console.log("Error to find nodes "+moduleName+" to link with "+importedElementName+"...");
                }
        }
    }

    async visitExportSpecifier(node: ExportSpecifier): Promise<void>{
        
        var moduleName = node.getSourceFile().fileName.replace(/\.[^/.]+$/, "");
        var exportedElementName = node.getText();

        var exportedElementNode = await this.neoGraph.getNodeWithModule(exportedElementName, moduleName);
        if(exportedElementNode !== undefined){
            var moduleNode = await this.neoGraph.getNode(moduleName);
            if(moduleNode !== undefined){
                await this.neoGraph.updateLinkTwoNode(moduleNode, exportedElementNode, RelationType.INTERNAL, RelationType.EXPORT);
            }
            else
                console.log("Error to find nodes "+moduleName+" to link with "+exportedElementName+"...");
        }
    }
}