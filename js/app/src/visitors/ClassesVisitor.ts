import SymfinderVisitor from "./SymfinderVisitor";
import { EntityType, EntityAttribut, EntityVisibility, NodeType, RelationType } from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import { ClassDeclaration, InterfaceDeclaration, isClassDeclaration, isInterfaceDeclaration, isMethodDeclaration, isMethodSignature, MethodDeclaration, MethodSignature, Node, SyntaxKind } from "typescript";

export default class ClassesVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    /**
     * Visit Class and Interface declaration nodes
     * @param node AST node
     * @returns ...
     */
    async visit(node: Node): Promise<void> {

        if(isInterfaceDeclaration(node)) await this.visitInterface(node);
        else if(isClassDeclaration(node)) await this.visitClass(node);
        else if(isMethodDeclaration(node) || isMethodSignature(node)) await this.visitMethod(node);
        else return;
    }

    async visitInterface(node: InterfaceDeclaration): Promise<void>{

        var nodeType: NodeType = EntityType.INTERFACE;   
        var modifiers = node.modifiers?.map(m => m.kind);
        var nodeVisibility = modifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var name = node.name?.getText();
        var nodeTypeList: NodeType[] = [nodeVisibility];
        await this.neoGraph.createNode(name, nodeType, nodeTypeList).catch((reason) => console.log("Error to create node "+name+"..."));
        return;
    }

    async visitClass(node: ClassDeclaration): Promise<void>{

        var name = node.name?.getText();
        if(name === undefined) return;

        var nodeType: NodeType = EntityType.CLASS;
        var modifiers = node.modifiers?.map(m => m.kind);
        var nodeVisibility = modifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var nodeTypeList: NodeType[] = [nodeVisibility];
        if(modifiers?.includes(SyntaxKind.AbstractKeyword))nodeTypeList.push(EntityAttribut.ABSTRACT);

        await this.neoGraph.createNode(name, nodeType, nodeTypeList).catch((reason) => console.log("Error to create node "+name+"..."));
        return;
    }

    async visitMethod(node: MethodDeclaration | MethodSignature): Promise<void>{
        
        var parentNode = (<ClassDeclaration | InterfaceDeclaration>node.parent)
        var className = parentNode.name?.getText();
        if(className === undefined) return;
        var modifiers = node.modifiers?.map(m => m.kind);
        var nodeVisibility = modifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var name = node.name?.getText();
        var classModifiers = parentNode.modifiers?.map(m => m.kind);
        var classVisibility = classModifiers?.includes(SyntaxKind.PrivateKeyword) ? EntityVisibility.PRIVATE : EntityVisibility.PUBLIC;
        var nodeTypeList: NodeType[] = [];
        var nodeType = EntityType.METHOD;

        if(modifiers?.includes(SyntaxKind.AbstractKeyword)) nodeTypeList.push(EntityAttribut.ABSTRACT);
        if(classVisibility == EntityVisibility.PUBLIC) {
            nodeTypeList.push(nodeVisibility)
        }
        return this.neoGraph.createNode(name, nodeType, nodeTypeList).then(async (neoNode) => {
            if(className === undefined) return;
            var neoClassNode = await this.neoGraph.getNode(className);
            if(neoClassNode !== undefined)
                return this.neoGraph.linkTwoNodes(neoClassNode, neoNode, RelationType.METHOD);
            else
                console.log("Error to link nodes "+name+" and "+className+"...");
        }).catch((reason) => console.log("Error to create node "+name+"..."));
        
    }
}