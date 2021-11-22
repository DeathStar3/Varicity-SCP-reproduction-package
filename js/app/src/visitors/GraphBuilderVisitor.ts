import * as ts from "typescript";
import SymfinderVisitor from "./SymfinderVisitor";
import {EntityType, EntityAttribut, EntityVisibility, NodeType, UnknownEntity, RelationType} from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";

export default class GraphBuilderVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    //Visit HeritageClauses
    async visit(node: ts.Node) {

        if(!ts.isHeritageClause(node)) return;

        var className: string = (<any>node.parent).name.escapedText;
        var classType: EntityType; 
        var superClassesName: string[] = (<any>node).types.map((type: any) => type.expression.escapedText);
        var superClasseType: EntityType;
        var relationType: RelationType;

        if((<any>node.parent).kind == ts.SyntaxKind.InterfaceDeclaration)
            classType = EntityType.INTERFACE;
        else if((<any>node.parent).kind == ts.SyntaxKind.ClassDeclaration)
            classType = EntityType.CLASS;
        else return;

        if((<any>node).token == ts.SyntaxKind.ImplementsKeyword){
            superClasseType = EntityType.INTERFACE;
            relationType = RelationType.IMPLEMENTS;
        }
        else if((<any>node).token == ts.SyntaxKind.ExtendsKeyword){
            superClasseType = EntityType.CLASS;
            relationType = RelationType.EXTENDS;
        }
        else return;

        for(let scn of superClassesName){
            var superClassNode = await this.neoGraph.getOrCreateNode(scn, superClasseType, [EntityAttribut.OUT_OF_SCOPE], []);
            var classNode = await this.neoGraph.getNode(className, classType);
            this.neoGraph.linkTwoNodes(superClassNode, classNode, relationType);
        };
        
        console.log("Name : " + className)
        console.log(relationType + " : " + superClassesName + "\n")
    }
}