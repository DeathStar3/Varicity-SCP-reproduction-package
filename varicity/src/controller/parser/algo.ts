import {EntitiesList} from "../../model/entitiesList";
import * as data from '../../../symfinder_files/jfreechart-v1.5.0.json';
import {NodeElement} from "./symfinder_entities/nodes/node";
import {ClassImplem} from "../../model/entitiesImplems/classImplem.model";
import {PackageImplem} from "../../model/entitiesImplems/packageImplem.model";

export class Algo {
    public parse(fileName: string) : EntitiesList {
        // const rawData = fs.readFileSync("../../symfinder_files/"+fileName+".json");
        // const jsonData = JSON.parse(rawData.toString());
        console.log(JSON.stringify(data));

        const nodesList: NodeElement[] = [];
        data.nodes.forEach(n => {
            let node = new NodeElement(n.name);
            node.nbFunctions = (n.allMethods === undefined) ? 0 : n.allMethods;

            const attr = n.attributes;
            let cpt = 0;
            attr.forEach(a => {
                cpt += a.number;
            })
            node.nbAttributes = cpt;
            nodesList.push(node);
        });

        const packagesList: PackageImplem[] = [];
        const classesList: ClassImplem[] = [];

        nodesList.forEach(n => {
            Algo.addToLists(n.name.split('.'), /*n.type,*/ n.nbFunctions, n.nbAttributes, packagesList, classesList);
        });

        let result = new EntitiesList();
        result.buildings = classesList;
        result.districts = packagesList;

        console.log(result);

        return result;
    }

    private static addToLists(splitName: string[], /*type: NodeType,*/ nbFunctions: number, nbAttributes: number, packagesList: PackageImplem[], classesList: ClassImplem[]) {
        if (splitName.length >= 2) { // When there is a class found
            const p = Algo.getPackageFromName(splitName[0], packagesList);
            if (p !== undefined) { // if the package is found at this level we can add the class into it
                if (splitName.length == 2) { // if the class is terminal then add it to the package
                    p.addBuilding(new ClassImplem(splitName[1], nbFunctions, nbAttributes));
                } else { // else add it to the corresponding subPackage
                    Algo.addToLists(splitName.slice(1), nbFunctions, nbAttributes, p.districts, classesList);
                }
            } else { // if not then we create the package and add the building to it
                const newP = new PackageImplem(splitName[0]);
                packagesList.push(newP);
                if (splitName.length == 2) { // If the class is terminal then add it to the package
                    newP.addBuilding(new ClassImplem(splitName[1], nbFunctions, nbAttributes));
                } else { // else add it to its packages list
                    Algo.addToLists(splitName.slice(1), nbFunctions, nbAttributes, newP.districts, classesList);
                }
            }
        } else { // if the depth is 0, then add it to the classesList
            const newC = new ClassImplem(splitName[0], nbFunctions, nbAttributes);
            classesList.push(newC);
        }
    }

    private static getPackageFromName(name: string, packagesList: PackageImplem[]) : PackageImplem {
        let result : PackageImplem = undefined;
        packagesList.forEach(p => {
            if (p.name === name){
                result = p;
            }
        });
        return result;
    }
}