import SymfinderVisitor from "./SymfinderVisitor";
import NeoGraph from "../neograph/NeoGraph";
import {
    isMethodDeclaration,
    isParameter,
    isPropertyDeclaration,
    isVariableDeclaration,
    MethodDeclaration,
    ObjectFlags,
    ObjectType,
    ParameterDeclaration,
    Program,
    PropertyDeclaration,
    SymbolFlags,
    TypeFlags,
    VariableDeclaration
} from "typescript";
import {RelationType} from "../neograph/NodeType";
import {filname_from_filepath} from "../utils/path";
import path = require("path");

export default class UsageVisitor extends SymfinderVisitor {

    constructor(neoGraph: NeoGraph, private program: Program){
        super(neoGraph);
    }

    async visit(node: VariableDeclaration): Promise<void>;
    async visit(node: ParameterDeclaration): Promise<void>;
    async visit(node: PropertyDeclaration): Promise<void>;
    async visit(node: MethodDeclaration): Promise<void>;

    /**
     * Visit different kind of variables found and publish their class type in neo4j
     * @param node AST node
     * @returns
     */
    async visit(node: VariableDeclaration | ParameterDeclaration | PropertyDeclaration | MethodDeclaration): Promise<void> {
        if(!isVariableDeclaration(node) && !isParameter(node) && !isPropertyDeclaration(node) && !isMethodDeclaration(node)) return;

        const name = node.name?.getText();
        // console.log("=="+name+"==")
        if(name === undefined) return;
        // @ts-ignore
        var filePath = path.relative(process.env.PROJECT_PATH, node.getSourceFile().fileName).substring(6);

        let className = "";
        let classPath = "";
        //TODO regarder comment récupérer chemin de la class depuis 'node.type'
        /*if(node.type !== undefined) {
            className = (<any>node.type).typeName.escapedText;
            console.log("node.type: ");
            console.log(node.type)
        } else {*/
            let type = this.program.getTypeChecker().getTypeAtLocation(node);
            if (type.flags != TypeFlags.Object || type.getSymbol() === undefined || (type as ObjectType).objectFlags != (ObjectFlags.Class + ObjectFlags.Reference)) return;
            if(type.symbol.flags === SymbolFlags.Method && node.type === undefined) return; //void method
            //TODO regarder comment récupérer chemin de la class depuis 'node.type' ou 'type'

            const qualifiedName = this.program.getTypeChecker().getFullyQualifiedName(type.getSymbol()!);
            // console.log(qualifiedName)
            const correctFormat = qualifiedName.match(/"([a-zA-Z0-9-._\/]+)"\.([a-zA-Z]+)/);
            if(correctFormat == null) {
                //TODO trouver la bonne class grâce au import
                //TODO ajout test sur pls class dans même fichier
                console.log("'"+qualifiedName+"' doesn't contain the path and the class name");
                return;
            }
            classPath = correctFormat[1];
            className = correctFormat[2];

            // className = type.symbol.getName();
        // console.log(qualifiedName);
        // console.log(type);
            classPath = (<any>type.symbol).parent.getEscapedName(); //FIXME crash quand création d'une instance
            classPath = classPath.substring(1, classPath.length - 1);
            if(className === "default") { // Arrive quand une class est de type default
                className = filname_from_filepath(classPath);
            }
        //}
        // @ts-ignore
        classPath = path.relative(process.env.PROJECT_PATH, classPath).substring(6) + ".ts";

        let varNode = await this.neoGraph.getNodeWithFile(name, filePath);
        const classNode = await this.neoGraph.getClassNodeWithPath(className, classPath);
        if(varNode != undefined && classNode != undefined)
            return await this.neoGraph.linkTwoNodes(varNode, classNode, RelationType.TYPE_OF);
        else
            console.log("Error to link 'usage' nodes "+name+" and "+className+"...");
    }

}
