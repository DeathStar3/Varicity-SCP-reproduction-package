import SymfinderVisitor from "./SymfinderVisitor";
import { DesignPatternType } from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import { isPropertyDeclaration, Node } from "typescript";

export default class StrategyTemplateDecoratorVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    /**
     * Visit Property declaration
     * @param node AST node
     * @returns ...
     */
    async visit(node: Node): Promise<void> {

        if(!isPropertyDeclaration(node) || node.type === undefined) return;
        
        var propertyTypeName = node.type.getText();
        var propertyTypeNode = await this.neoGraph.getNode(propertyTypeName);
        if(propertyTypeNode !== undefined){
            var propertyTypeNbVariant = await this.neoGraph.getNbVariant(propertyTypeNode);
            if(propertyTypeNbVariant >= 2){
                await this.neoGraph.addLabelToNode(propertyTypeNode, DesignPatternType.STRATEGY);
                //console.log("Strategy detected : " + propertyTypeName+"\n");
            }
        }
        return;
    }
}