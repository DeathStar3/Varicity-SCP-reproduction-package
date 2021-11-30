import SymfinderVisitor from "./SymfinderVisitor";
import { EntityType, EntityAttribut, EntityVisibility, NodeType, RelationType } from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import { ClassDeclaration, ConstructorDeclaration, InterfaceDeclaration, isClassDeclaration, isConstructorDeclaration, isInterfaceDeclaration, isMethodDeclaration, isMethodSignature, isSourceFile, MethodDeclaration, MethodSignature, Node, SourceFile, SyntaxKind } from "typescript";

export default class ClassesVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    async visit(node: InterfaceDeclaration): Promise<void>;
    async visit(node: ClassDeclaration): Promise<void>;
    async visit(node: MethodDeclaration): Promise<void>;
    async visit(node: MethodSignature): Promise<void>;
    async visit(node: ConstructorDeclaration): Promise<void>;
    async visit(node: SourceFile): Promise<void>;

    /**
     * Visit Class and Interface declaration nodes
     * @param node AST node
     * @returns ...
     */
    async visit(node: InterfaceDeclaration | ClassDeclaration | MethodDeclaration | MethodSignature | ConstructorDeclaration | SourceFile): Promise<void> {

        if(isInterfaceDeclaration(node)) await this.visitInterface(node);
        else if(isClassDeclaration(node)) await this.visitClass(node);
        else if(isMethodDeclaration(node) || isMethodSignature(node) || isConstructorDeclaration(node)) await this.visitMethod(node);
        else if(isSourceFile(node)) await this.visitSourceFile(node);
        else return;
    }

    async visitInterface(node: InterfaceDeclaration): Promise<void>{

        var nodeType: NodeType = EntityType.INTERFACE;   
        var modifiers = node.modifiers?.map(m => m.kind);
        var nodeVisibility = modifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var relationType = modifiers?.includes(SyntaxKind.ExportKeyword) ? RelationType.EXPORT : RelationType.INTERNAL;
        var name = node.name?.getText();
        var nodeTypeList: NodeType[] = [nodeVisibility];
        var moduleName = node.getSourceFile().fileName.replace(/\.[^/.]+$/, "");
        await this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
            if(moduleName === undefined) return;
            var neoModuleNode = await this.neoGraph.getNode(moduleName);
            if(neoModuleNode !== undefined)
                return await this.neoGraph.linkTwoNodes(neoModuleNode, neoNode, relationType);
            else
                console.log("Error to link nodes "+name+" and "+moduleName+"...");
        }).catch((reason) => console.log("Error to create node "+name+"..."));
        return;
    }

    async visitClass(node: ClassDeclaration): Promise<void>{

        var name = node.name?.getText();
        if(name === undefined) return;

        var nodeType: NodeType = EntityType.CLASS;
        var modifiers = node.modifiers?.map(m => m.kind);
        var nodeVisibility = modifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var relationType = modifiers?.includes(SyntaxKind.ExportKeyword) ? RelationType.EXPORT : RelationType.INTERNAL;
        var nodeTypeList: NodeType[] = [nodeVisibility];
        if(modifiers?.includes(SyntaxKind.AbstractKeyword))nodeTypeList.push(EntityAttribut.ABSTRACT);
        var moduleName = node.getSourceFile().fileName.replace(/\.[^/.]+$/, "");
        await this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
            if(moduleName === undefined) return;
            var neoModuleNode = await this.neoGraph.getNode(moduleName);
            if(neoModuleNode !== undefined)
                return await this.neoGraph.linkTwoNodes(neoModuleNode, neoNode, relationType);
            else
                console.log("Error to link nodes "+name+" and "+moduleName+"...");
        }).catch((reason) => console.log("Error to create node "+name+"..."));
        return;
    }

    async visitMethod(node: MethodDeclaration | MethodSignature | ConstructorDeclaration): Promise<void>{
        
        var parentNode = (<ClassDeclaration | InterfaceDeclaration>node.parent)
        var className = parentNode.name?.getText();
        if(className === undefined) return;
        var modifiers = node.modifiers?.map(m => m.kind);
        var nodeVisibility = modifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var name = isConstructorDeclaration(node) ? className : node.name?.getText();
        var classModifiers = parentNode.modifiers?.map(m => m.kind);
        var classVisibility = classModifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var nodeTypeList: NodeType[] = [];
        var nodeType = isConstructorDeclaration(node) ? EntityType.CONSTRUCTOR : EntityType.METHOD;
        var moduleName = node.getSourceFile().fileName.replace(/\.[^/.]+$/, "")

        if(modifiers?.includes(SyntaxKind.AbstractKeyword)) nodeTypeList.push(EntityAttribut.ABSTRACT);
        if(classVisibility == EntityVisibility.PUBLIC) {
            nodeTypeList.push(nodeVisibility)
        }
        return await this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
            if(className === undefined) return;
            var neoClassNode = await this.neoGraph.getNodeWithModule(className, moduleName);
            if(neoClassNode !== undefined)
                return await this.neoGraph.linkTwoNodes(neoClassNode, neoNode, RelationType.METHOD);
            else
                console.log("Error to link nodes "+name+" and "+className+"...");
        }).catch((reason) => console.log("Error to create node "+name+"..."));
    }

    async visitSourceFile(node: SourceFile): Promise<void> {
        var nodeType: NodeType = EntityType.MODULE;
        var name = node.fileName.replace(/\.[^/.]+$/, "")
        await this.neoGraph.createNode(name, nodeType, []).catch((reason) => console.log("Error to create node "+name+"..."));
        return;
    }
}