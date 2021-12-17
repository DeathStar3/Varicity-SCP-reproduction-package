import SymfinderVisitor from "./SymfinderVisitor";
import { EntityType, EntityAttribut, EntityVisibility, NodeType, RelationType } from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, InterfaceDeclaration, isClassDeclaration, isConstructorDeclaration, isFunctionDeclaration, isInterfaceDeclaration, isMethodDeclaration, isMethodSignature, isSourceFile, isVariableStatement, MethodDeclaration, MethodSignature, Node, SourceFile, SyntaxKind, VariableDeclaration, VariableStatement } from "typescript";
import { filname_from_filepath } from "../utils/path";
export default class ClassesVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    async visit(node: InterfaceDeclaration): Promise<void>;
    async visit(node: ClassDeclaration): Promise<void>;
    async visit(node: MethodDeclaration): Promise<void>;
    async visit(node: MethodSignature): Promise<void>;
    async visit(node: ConstructorDeclaration): Promise<void>;
    async visit(node: FunctionDeclaration): Promise<void>;
    async visit(node: VariableStatement): Promise<void>; 

    /**
     * Visit Class and Interface declaration nodes
     * @param node AST node
     * @returns ...
     */
    async visit(node: InterfaceDeclaration | ClassDeclaration | MethodDeclaration | MethodSignature | ConstructorDeclaration | FunctionDeclaration | VariableStatement): Promise<void> {

        if(isInterfaceDeclaration(node)) await this.visitInterface(node);
        else if(isClassDeclaration(node)) await this.visitClass(node);
        else if(isMethodDeclaration(node) || isMethodSignature(node) || isConstructorDeclaration(node)) await this.visitMethod(node);
        else if(isFunctionDeclaration(node)) await this.visitFunction(node);
        else if(isVariableStatement(node)) await this.visitVariable(node);
        else return;
    }

    async visitInterface(node: InterfaceDeclaration): Promise<void>{

        var nodeType: NodeType = EntityType.INTERFACE;   
        var modifiers = node.modifiers?.map(m => m.kind);
        var nodeVisibility = modifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var relationType = modifiers?.includes(SyntaxKind.ExportKeyword) ? RelationType.EXPORT : RelationType.INTERNAL;
        var name = node.name?.getText();
        var nodeTypeList: NodeType[] = [nodeVisibility];
        var filePath = node.getSourceFile().fileName;
        var fileName = filname_from_filepath(filePath);
        await this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
            if(filePath === undefined || fileName === undefined) return;
            var neoFileNode = await this.neoGraph.getNodeWithPath(fileName, filePath);
            if(neoFileNode !== undefined)
                return await this.neoGraph.linkTwoNodes(neoFileNode, neoNode, relationType);
            else
                console.log("Error to link nodes "+name+" and "+fileName+"...");
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
        var filePath = node.getSourceFile().fileName;
        var fileName = filname_from_filepath(filePath);
        await this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
            if(filePath === undefined || fileName === undefined) return;
            var neoFileNode = await this.neoGraph.getNodeWithPath(fileName, filePath);
            if(neoFileNode !== undefined)
                return await this.neoGraph.linkTwoNodes(neoFileNode, neoNode, relationType);
            else
                console.log("Error to link nodes "+name+" and "+fileName+"...");
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
        var filePath = node.getSourceFile().fileName;

        if(modifiers?.includes(SyntaxKind.AbstractKeyword)) nodeTypeList.push(EntityAttribut.ABSTRACT);
        if(classVisibility == EntityVisibility.PUBLIC) {
            nodeTypeList.push(nodeVisibility)
        }
        return await this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
            if(className === undefined) return;
            var neoClassNode = await this.neoGraph.getNodeWithFile(className, filePath);
            if(neoClassNode !== undefined)
                return await this.neoGraph.linkTwoNodes(neoClassNode, neoNode, RelationType.METHOD);
            else
                console.log("Error to link nodes "+name+" and "+className+"...");
        }).catch((reason) => console.log("Error to create node "+name+"..."));
    }

    async visitFunction(node: FunctionDeclaration): Promise<void>{

        var name = node.name?.getText()
        if(name === undefined) return;
        var filePath = node.getSourceFile().fileName;
        var fileName = filname_from_filepath(filePath);
        var modifiers = node.modifiers?.map(m => m.kind);
        var relationType = modifiers?.includes(SyntaxKind.ExportKeyword) ? RelationType.EXPORT : RelationType.INTERNAL;
        var nodeTypeList: NodeType[] = [];
        var nodeType = EntityType.FUNCTION;

        return await this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
            if(filePath === undefined || fileName === undefined) return;
            var neoFileNode = await this.neoGraph.getNodeWithPath(fileName, filePath);
            if(neoFileNode !== undefined)
                return await this.neoGraph.linkTwoNodes(neoFileNode, neoNode, relationType);
            else
                console.log("Error to link nodes "+name+" and "+fileName+"...");
        }).catch((reason) => console.log("Error to create node "+name+"..."));
    }

    async visitVariable(node: VariableStatement): Promise<void>{

        var modifiers = node.modifiers?.map(m => m.kind);
        var relationType = modifiers?.includes(SyntaxKind.ExportKeyword) ? RelationType.EXPORT : RelationType.INTERNAL;
        var nodeTypeList: NodeType[] = [];
        var nodeType = EntityType.VARIABLE;
        var filePath = node.getSourceFile().fileName;
        var fileName = filname_from_filepath(filePath);

        for(let variableDeclaration of node.declarationList.declarations){
            var name = variableDeclaration.name?.getText()
            if(name === undefined) return;
            
            await this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
                if(filePath === undefined || fileName === undefined) return;
                var neoFileNode = await this.neoGraph.getNodeWithPath(fileName, filePath);
                if(neoFileNode !== undefined)
                    return await this.neoGraph.linkTwoNodes(neoFileNode, neoNode, relationType);
                else
                    console.log("Error to link nodes "+name+" and "+fileName+"...");
            }).catch((reason) => console.log("Error to create node "+name+"..."));
        }
        return;
        

    }
}