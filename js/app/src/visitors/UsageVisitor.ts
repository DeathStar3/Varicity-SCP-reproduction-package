import SymfinderVisitor from "./SymfinderVisitor";
import NeoGraph from "../neograph/NeoGraph";
import {
    isParameter,
    isPropertyDeclaration,
    isVariableDeclaration,
    ParameterDeclaration,
    Program,
    PropertyDeclaration,
    TypeFlags,
    VariableDeclaration
} from "typescript";
import {RelationType} from "../neograph/NodeType";

export default class UsageVisitor extends SymfinderVisitor {

    constructor(neoGraph: NeoGraph, private program: Program){
        super(neoGraph);
    }

    async visit(node: VariableDeclaration): Promise<void>;
    async visit(node: ParameterDeclaration): Promise<void>;
    async visit(node: PropertyDeclaration): Promise<void>;

    /**
     * Visit different kind of variables found and publish their class type in neo4j
     * @param node AST node
     * @returns
     */
    async visit(node: VariableDeclaration | ParameterDeclaration | PropertyDeclaration): Promise<void> {
        if(!isVariableDeclaration(node) && !isParameter(node) && !isPropertyDeclaration(node)) return;

        const name = node.name?.getText()
        if(name === undefined) return;
        const filePath = node.getSourceFile().fileName;

        let type = this.program.getTypeChecker().getTypeAtLocation(node);
        if(type.flags != TypeFlags.Object) return;
        let className: string = type.symbol.getName();
        if(className === "default") // Arrive quand le type est un alias d'une class importée. Ex: ClassOneOne dans test_project/modules/moduleB
            className = (<any>type.symbol.declarations?.at(0))?.localSymbol.getName();

        let varNode = await this.neoGraph.getNodeWithFile(name, filePath);
        const classNode = await this.neoGraph.getNode(className);
        if(varNode != undefined && classNode != undefined)
            return await this.neoGraph.linkTwoNodes(varNode, classNode, RelationType.TYPE_OF);
        else
            console.log("Error to link 'usage' nodes "+name+" and "+className+"...");
    }

}
