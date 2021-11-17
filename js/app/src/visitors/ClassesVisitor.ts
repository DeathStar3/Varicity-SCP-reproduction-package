import * as ts from "typescript";
import SymfinderVisitor from "./SymfinderVisitor";
import {EntityType, EntityAttribut, EntityVisibility, NodeType} from "../neograph/NodeType";

export default class ClassesVisitor extends SymfinderVisitor{

    visit(node: ts.Node): void{

        var type = node.kind;
        if(type != ts.SyntaxKind.ClassDeclaration && type != ts.SyntaxKind.InterfaceDeclaration) return;

        var nodeType;
        var nodeTypeList: NodeType[] = [];
        var modifiers = node.modifiers?.map(modifier => modifier.kind);
        var nodeVisibility = modifiers?.includes(ts.SyntaxKind.ExportKeyword) ? EntityVisibility.PUBLIC : EntityVisibility.PRIVATE;

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
        console.log("Type : " + nodeType?.toString());
        console.log("Type List : ");
        nodeTypeList.forEach(t => console.log(t.toString()))
    }
}