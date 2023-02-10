/*
 * This file is part of symfinder.
 *
 * symfinder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * symfinder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2021-2022 Bruel Martin <martin.bruel999@gmail.com>
 */
import SymfinderVisitor from "./SymfinderVisitor";
import { EntityType, EntityAttribut, EntityVisibility, NodeType, RelationType } from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import { ClassDeclaration, ClassExpression, ConstructorDeclaration, FunctionDeclaration, InterfaceDeclaration, isClassDeclaration, isClassExpression, isConstructorDeclaration, isFunctionDeclaration, isInterfaceDeclaration, isMethodDeclaration, isMethodSignature, isSourceFile, isVariableStatement, MethodDeclaration, MethodSignature, Node, SourceFile, SyntaxKind, VariableDeclaration, VariableStatement } from "typescript";
import { filname_from_filepath } from "../utils/path";
export default class ClassesVisitor extends SymfinderVisitor{

    constructor(neoGraph: NeoGraph){
        super(neoGraph);
    }

    async visit(node: InterfaceDeclaration): Promise<void>;
    async visit(node: ClassDeclaration | ClassExpression): Promise<void>;
    async visit(node: MethodDeclaration): Promise<void>;
    async visit(node: MethodSignature): Promise<void>;
    async visit(node: ConstructorDeclaration): Promise<void>;
    async visit(node: FunctionDeclaration): Promise<void>;
    async visit(node: VariableStatement): Promise<void>; 

    /**
     * Visit InterfaceDeclaration | ClassDeclaration | ClassExpression | MethodDeclaration | MethodSignature | ConstructorDeclaration | FunctionDeclaration | VariableStatement
     * @param node AST node
     * @returns ...
     */
    async visit(node: InterfaceDeclaration | ClassDeclaration | ClassExpression | MethodDeclaration | MethodSignature | ConstructorDeclaration | FunctionDeclaration | VariableStatement): Promise<void> {

        if(isInterfaceDeclaration(node)) await this.visitInterface(node);
        else if(isClassDeclaration(node) || isClassExpression(node)) await this.visitClass(node);
        else if(isMethodDeclaration(node) || isMethodSignature(node) || isConstructorDeclaration(node)) await this.visitMethod(node);
        else if(isFunctionDeclaration(node)) await this.visitFunction(node);
        else if(isVariableStatement(node)) await this.visitVariable(node);
        else return;
    }

    /**
     * Visit InterfaceDeclaration and publish Interface in neo4j
     * @param node 
     * @returns 
     */
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

    /**
     * Visit ClassDeclaration | ClassExpression and publish Class in neo4j
     * @param node AST node
     * @returns 
     */
    async visitClass(node: ClassDeclaration | ClassExpression): Promise<void>{

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

    /**
     * Visit MethodDeclaration | MethodSignature | ConstructorDeclaration and publish Method and Constructor in neo4j
     * @param node AST node
     * @returns 
     */
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

    /**
     * Visit FunctionDeclaration and publish Function in neo4j
     * @param node AST node
     * @returns 
     */
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

    /**
     * Visit VariableStatement and publish variable in neo4j
     * @param node AST node
     * @returns 
     */
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