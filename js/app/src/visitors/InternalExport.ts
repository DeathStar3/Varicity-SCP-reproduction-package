import SymfinderVisitor from "./SymfinderVisitor";
import {ExportDeclaration, ExportSpecifier, isExportDeclaration, Program} from "typescript";
import {filname_from_filepath} from "../utils/path";
import {RelationType} from "../neograph/NodeType";
import NeoGraph from "../neograph/NeoGraph";
import path = require("path");

export default class InternalExport extends SymfinderVisitor {

    constructor(neoGraph: NeoGraph, public program: Program){
        super(neoGraph);
    }

    async visit(node: ExportDeclaration): Promise<void>;

    // Only "export { A, B...}"
    async visit(node: ExportDeclaration): Promise<void> {
        if (!isExportDeclaration(node)) return;
        if(node.moduleSpecifier !== undefined)
            return;
        // @ts-ignore
        const filePath = path.relative(process.env.PROJECT_PATH, node.getSourceFile().fileName).substring(6);
        const fileName = filname_from_filepath(filePath);
        for(const exportSpecifier of (<any>node.exportClause).elements) {
            if(exportSpecifier.isTypeOnly) continue;
            let exportedElementName: string = exportSpecifier.propertyName ? exportSpecifier.propertyName.getText() : exportSpecifier.name.getText();
            let classPath = this.getPath(exportSpecifier, filePath);
            let exportedElementNode = await this.neoGraph.getNodeWithFile(exportedElementName, classPath);
            const fileNode = await this.neoGraph.getNodeWithPath(fileName, filePath);
            if (fileNode === undefined) {
                console.log("Error to find nodes " + fileName);
                return;
            }
            if (exportSpecifier.propertyName !== undefined) {
                if (exportedElementNode === undefined) return;
                exportedElementName = exportSpecifier.name.getText();
                exportedElementNode = await this.neoGraph.setAlternativeName(fileNode, exportedElementNode, exportedElementName);
            }

            if (exportedElementNode !== undefined) {
                await this.neoGraph.updateLinkTwoNode(fileNode, exportedElementNode, RelationType.INTERNAL, RelationType.EXPORT);
            } else
                console.log("Error to find nodes " + exportedElementName + " to link with " + filePath + "...");
        }
    }

    getPath(node: ExportSpecifier, filePath: string) {
        let classPath;
        const symbol = this.program.getTypeChecker().getTypeAtLocation(node).getSymbol();
        if(symbol === undefined)
            return filePath;
        const qualifiedName = this.program.getTypeChecker().getFullyQualifiedName(symbol);
        let correctFormat = qualifiedName.match(/^"([a-zA-Z0-9-._\/]+)"\.([a-zA-Z_0-9.]+)$/);
        if (correctFormat == null) {
            return filePath;
        } else {
            classPath = correctFormat[1];
            if(classPath.includes("/")) {
                // @ts-ignore
                classPath = path.relative(process.env.PROJECT_PATH, classPath).substring(6) + ".ts";
            }
            return classPath;
        }
    }

}
