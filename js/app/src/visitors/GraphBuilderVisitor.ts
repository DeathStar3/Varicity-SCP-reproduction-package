import SymfinderVisitor from "./SymfinderVisitor";
import { EntityType, EntityAttribut, RelationType } from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import { HeritageClause, isHeritageClause, Node, SyntaxKind } from "typescript";

export default class GraphBuilderVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    /**
     * Visit heritage clause
     * @param node AST node
     * @returns ...
     */
    async visit(node: Node): Promise<void> {

        if(isHeritageClause(node)) await this.visitHeritageClause(node);
        return;        
    }

    async visitHeritageClause(node: HeritageClause): Promise<void>{
        
        if(node.parent.name === undefined) return;
        var className: string = node.parent.name?.getText();
        var classType: EntityType; 
        var superClassesName: string[] = node.types.map((type) => type.expression.getText());
        var superClasseType: EntityType;
        var relationType: RelationType;

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
                    var classNode = await this.neoGraph.getNodeWithType(className, classType)
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
}