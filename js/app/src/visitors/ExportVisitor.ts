import SymfinderVisitor from "./SymfinderVisitor";
import NeoGraph from "../neograph/NeoGraph";
import {ExportDeclaration, isExportDeclaration, Program} from "typescript";
import {filname_from_filepath} from "../utils/path";
import {RelationType} from "../neograph/NodeType";
import path = require("path");
import Parser from "../parser/Parser";

export default class ExportVisitor extends SymfinderVisitor {

    constructor(neoGraph: NeoGraph, public program: Program){
        super(neoGraph);
    }

    async visit(node: ExportDeclaration): Promise<void>;

    // Only "export { A, B...} from 'path'"
    async visit(node: ExportDeclaration): Promise<void> {
        if(!isExportDeclaration(node)) return;
        if(node.moduleSpecifier === undefined)
            return;
        // @ts-ignore
        const filePath = path.relative(process.env.PROJECT_PATH, node.getSourceFile().fileName).substring(6);
        const fileName = filname_from_filepath(filePath);
        const module = (<any>node.moduleSpecifier).text;
        const moduleName = module.split('/').slice(-1)[0] + '.ts';
        let modulePath = path.join(path.dirname(filePath), module) + ".ts";
        if(this.program.getSourceFile(modulePath) === undefined) {
            modulePath = path.join(path.dirname(modulePath), module, "index.ts");
        }
        const fileNode = await this.neoGraph.getNodeWithPath(fileName, filePath);
        if(fileNode === undefined) {
            console.log("Cannot find file : '" + filePath + "' in graph...");
            return;
        }

        if(this.program.getSourceFile(modulePath) === undefined || modulePath == filePath || node.isTypeOnly)
            return

        if(filePath === "../experiments/prisma/packages/client/src/runtime/index.ts")
            debugger

        if(node.exportClause === undefined || 'name' in node.exportClause) {
            try {
                // await new Parser(modulePath, this.program).accept(this); //Can lead to an infinite loop, but less EXPORT relationship is made
                const exportNodes = await this.neoGraph.getAllNodes(modulePath, RelationType.EXPORT);
                for(const exportNode of exportNodes) {
                    await this.neoGraph.linkTwoNodes(fileNode, exportNode, RelationType.EXPORT);
                    if(node.exportClause !== undefined && 'name' in node.exportClause) {
                        await this.neoGraph.setAlternativeName(fileNode, exportNode, node.exportClause.name.text);
                    }
                }
            } catch (e) {
                //it can happen if it's a .d.ts file
            }
        } else {
            for(const exportSpecifier of (<any>node.exportClause).elements) {
                if(exportSpecifier.isTypeOnly) continue;
                let exportedElementName: string = exportSpecifier.propertyName ? exportSpecifier.propertyName.getText() : exportSpecifier.name.getText();
                let exportedElementNode = await this.neoGraph.getNodeWithFile(exportedElementName, modulePath);
                if(exportedElementNode === undefined) {
                    try {
                        await new Parser(modulePath, this.program).accept(this);
                        exportedElementNode = await this.neoGraph.getNodeWithFile(exportedElementName, modulePath);
                    } catch (e) {
                        //it can happen if it's a .d.ts file
                        return;
                    }
                }
                if(exportedElementNode !== undefined) {
                    await this.neoGraph.linkTwoNodes(fileNode, exportedElementNode, RelationType.EXPORT);
                    if (exportSpecifier.propertyName !== undefined) {
                        exportedElementName = exportSpecifier.name.getText();
                        await this.neoGraph.setAlternativeName(fileNode, exportedElementNode, exportedElementName);
                    }
                } else
                    console.log("Error to link nodes "+filePath+" and "+modulePath+" - cannot get "+exportedElementName);
            }
        }
    }

}
