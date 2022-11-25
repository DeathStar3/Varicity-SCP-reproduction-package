import { JsonInputInterface } from "../../../model/entities/jsonInput.interface";
import { ClassImplem } from "../../../model/entitiesImplems/classImplem.model";
import { Config } from "../../../model/entitiesImplems/config.model";
import { JsDistrict } from "../../../model/entitiesImplems/jsDistrict.model";
import { EntitiesList } from "../../../model/entitiesList";
import { LinkElement } from "../symfinder_elements/links/link.element";
import { NodeElement } from "../symfinder_elements/nodes/node.element";
import { ParsingStrategy } from "./parsing.strategy.interface";

export class JsTestStrategy implements ParsingStrategy {
    parse(data: JsonInputInterface, config: Config, project: string): EntitiesList {
        console.log(`Test JS [Project: ${project}]: `, data);
        console.log('Config used: ', config);

        if (data) {
            let nodeList: NodeElement[] = [];
            data.nodes.forEach(n => {
                let node = new NodeElement(n.name);

                const attr = n.attributes;
                let nbAttributes = 0;
                attr.forEach(a => {
                    nbAttributes += a.number;
                })

                node.types = [...n.types];

                nodeList.push(node);
            });

            let result = new EntitiesList();
            result.buildings = [];

            result.district = new JsDistrict();
            nodeList.forEach(n => {
                let building = new ClassImplem(n, 0);
                result.district.addBuilding(building);
                result.buildings.push(building);
            })

            console.log("Result of parsing: ", result);
            return result;
        }
        throw 'Data is undefined';
    }
}