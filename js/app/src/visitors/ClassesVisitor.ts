import * as ts from "typescript";
import SymfinderVisitor from "./SymfinderVisitor";
import {EntityType, EntityAttribut, EntityVisibility, NodeType, UnknownEntity} from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";

export default class ClassesVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    visit(node: ts.Node): void{

        var type = node.kind;
        if(type != ts.SyntaxKind.ClassDeclaration && type != ts.SyntaxKind.InterfaceDeclaration) return;

        var nodeType: NodeType = UnknownEntity.UNKONWN;
        var nodeTypeList: NodeType[] = [];
        var modifiers = node.modifiers?.map(m => m.kind);
        var nodeVisibility = modifiers?.includes(ts.SyntaxKind.ExportKeyword) ? EntityVisibility.PUBLIC : EntityVisibility.PRIVATE;
        var name = (<any>node).name.escapedText

        if(type == ts.SyntaxKind.ClassDeclaration){
            
            if(modifiers?.includes(ts.SyntaxKind.AbstractKeyword)){
                nodeType = EntityType.CLASS;
                nodeTypeList = [EntityAttribut.ABSTRACT, nodeVisibility];
            }
            else{
                nodeType = EntityType.CLASS;
                nodeTypeList = [nodeVisibility];
            }            
        }
        if(type == ts.SyntaxKind.InterfaceDeclaration){
            nodeType = EntityType.INTERFACE;
            nodeTypeList = [nodeVisibility];
        }
        console.log("Name : " + name)
        console.log("Type : " + nodeType?.toString());
        console.log("Type List : " + nodeTypeList.join(' ') + "\n");

        this.neoGraph.createNode(name, nodeType, nodeTypeList);
    }
}