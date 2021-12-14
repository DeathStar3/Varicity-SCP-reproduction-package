import {expect} from 'chai';
import {ConfigService} from "../src/services/config.service";
import {VPVariantsStrategy} from "../src/controller/parser/strategies/vp_variants.strategy";
import {District} from '../src/model/entities/district.interface';
import {Orientation} from "../src/model/entitiesImplems/orientation.enum";
import {ProjectService} from '../src/services/project.service';
import {JsonInputInterface} from "../src/model/entities/jsonInput.interface";
import {ClassesPackagesStrategy} from "../src/controller/parser/strategies/classes_packages.strategy";
import {Config} from "../src/model/entitiesImplems/config.model";


function countBuilding(districts: District[]): number {
    let sum = 0;
    districts.forEach(d => {
        sum += d.buildings.length;
        sum += countBuilding(d.districts)
    })
    return sum;
}

function countDistricts(districts: District[]): number {
    let sum = 0;
    districts.forEach(d => {
        sum += 1;
        sum += countDistricts(d.districts)
    })
    return sum;
}

describe('parsing without filtering by composition level', function () {
    it('parse', async function () {
        let config = {} as Config;
        config.hierarchy_links = ["EXTENDS", "IMPLEMENTS"];
        config.api_classes = ["ChristmasTree"]
        config.orientation = Orientation.OUT
        config.default_level = 4

        const jsonInput = JSON.parse(test3ForVPParser) as JsonInputInterface
        let entities = new VPVariantsStrategy().parse(jsonInput, config, "");
        let dis = entities.district.districts
        let numberOfDistricts = countDistricts(dis);
        let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
        expect(numberOfBuiildings).equal(4);
        expect(numberOfDistricts).equal(2);
    });
});

describe('parsing with filtering by composition level', function () {
    it('parse', async function () {
        let config = {} as Config;
        config.hierarchy_links = ["EXTENDS", "IMPLEMENTS"];
        config.api_classes = ["ChristmasTree"]
        config.orientation = Orientation.IN_OUT;
        config.default_level = 4

        const jsonInput = JSON.parse(test3ForVPParser) as JsonInputInterface
        let entities = new VPVariantsStrategy().parse(jsonInput, config, "");
        let ent = entities.filterCompLevel(1);
        let dis = ent.district.districts
        let numberOfDistricts = countDistricts(dis);
        let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
        expect(numberOfBuiildings).equal(3); //correction 3 en 4
        expect(numberOfDistricts).equal(2);
    });
});

const test3ForVPParser = "{\"nodes\": [{\"types\": [\"CLASS\", \"PUBLIC\", \"VARIANT\"], \"constructorVPs\": 0, \"methods\": [{\"name\": \"decorateWithBubbleLights\", \"number\": 1}, {\"name\": \"decorate\", \"number\": 1}], \"allMethods\": 2, \"constructors\": [{\"name\": \"BubbleLights\", \"number\": 1}], \"publicConstructors\": 1, \"methodVariants\": 0, \"methodVPs\": 0, \"publicMethods\": 1, \"constructorVariants\": 0, \"name\": \"BubbleLights\", \"attributes\": [], \"nbCompositions\": 1}, {\"constructors\": [], \"types\": [\"INTERFACE\", \"PUBLIC\", \"STRATEGY\", \"VP\", \"COMPOSITION_STRATEGY\"], \"methods\": [{\"name\": \"decorate\", \"number\": 1}], \"name\": \"ChristmasTree\", \"attributes\": [{\"name\": \"TreeDecorator\", \"number\": 1}, {\"name\": \"ChristmasTreeImpl\", \"number\": 1}]}, {\"constructors\": [], \"publicConstructors\": 0, \"types\": [\"CLASS\", \"PUBLIC\", \"VARIANT\"], \"constructorVPs\": 0, \"methodVariants\": 0, \"methods\": [{\"name\": \"decorate\", \"number\": 1}], \"methodVPs\": 0, \"publicMethods\": 1, \"constructorVariants\": 0, \"name\": \"ChristmasTreeImpl\", \"attributes\": [], \"allMethods\": 1}, {\"types\": [\"CLASS\", \"PUBLIC\", \"ABSTRACT\", \"DECORATOR\", \"VP\", \"VARIANT\"], \"constructorVPs\": 0, \"methods\": [{\"name\": \"decorate\", \"number\": 1}], \"allMethods\": 1, \"constructors\": [{\"name\": \"TreeDecorator\", \"number\": 1}], \"publicConstructors\": 1, \"methodVariants\": 0, \"methodVPs\": 0, \"publicMethods\": 1, \"constructorVariants\": 0, \"name\": \"TreeDecorator\", \"attributes\": [{\"name\": \"BubbleLights\", \"number\": 1}], \"nbCompositions\": 1}], \"links\": [{\"type\": \"IMPLEMENTS\", \"source\": \"ChristmasTree\", \"target\": \"TreeDecorator\"}, {\"type\": \"IMPLEMENTS\", \"source\": \"ChristmasTree\", \"target\": \"ChristmasTreeImpl\"}, {\"type\": \"EXTENDS\", \"source\": \"TreeDecorator\", \"target\": \"BubbleLights\"}], \"allnodes\": [{\"types\": [\"CLASS\", \"PUBLIC\", \"VARIANT\"], \"constructorVPs\": 0, \"methods\": [{\"name\": \"decorateWithBubbleLights\", \"number\": 1}, {\"name\": \"decorate\", \"number\": 1}], \"interfaceAttributes\": [{\"name\": \"ChristmasTree\", \"number\": 1}], \"allMethods\": 2, \"constructors\": [{\"name\": \"BubbleLights\", \"number\": 1}], \"publicConstructors\": 1, \"methodVariants\": 0, \"methodVPs\": 0, \"publicMethods\": 1, \"constructorVariants\": 0, \"name\": \"BubbleLights\", \"attributes\": [], \"nbCompositions\": 1}, {\"constructors\": [], \"types\": [\"INTERFACE\", \"PUBLIC\", \"STRATEGY\", \"VP\", \"COMPOSITION_STRATEGY\"], \"methods\": [{\"name\": \"decorate\", \"number\": 1}], \"name\": \"ChristmasTree\", \"attributes\": [{\"name\": \"TreeDecorator\", \"number\": 1}, {\"name\": \"ChristmasTreeImpl\", \"number\": 1}], \"interfaceAttributes\": []}, {\"types\": [\"CLASS\", \"PUBLIC\", \"VARIANT\"], \"constructorVPs\": 0, \"methods\": [{\"name\": \"decorate\", \"number\": 1}], \"interfaceAttributes\": [], \"allMethods\": 1, \"constructors\": [], \"publicConstructors\": 0, \"methodVariants\": 0, \"methodVPs\": 0, \"publicMethods\": 1, \"constructorVariants\": 0, \"name\": \"ChristmasTreeImpl\", \"attributes\": []}, {\"types\": [\"CLASS\", \"PUBLIC\", \"ABSTRACT\", \"DECORATOR\", \"VP\", \"VARIANT\"], \"constructorVPs\": 0, \"methods\": [{\"name\": \"decorate\", \"number\": 1}], \"interfaceAttributes\": [{\"name\": \"ChristmasTree\", \"number\": 1}], \"allMethods\": 1, \"constructors\": [{\"name\": \"TreeDecorator\", \"number\": 1}], \"publicConstructors\": 1, \"methodVariants\": 0, \"methodVPs\": 0, \"publicMethods\": 1, \"constructorVariants\": 0, \"name\": \"TreeDecorator\", \"attributes\": [{\"name\": \"BubbleLights\", \"number\": 1}], \"nbCompositions\": 1}], \"linkscompose\": [{\"type\":\"USAGE\", \"source\": \"BubbleLights\", \"target\": \"ChristmasTree\"}, {\"type\":\"USAGE\", \"source\": \"TreeDecorator\", \"target\": \"ChristmasTree\"}], \"alllinks\": [{\"type\": \"EXTENDS\", \"source\": \"TreeDecorator\", \"target\": \"BubbleLights\"}, {\"type\":\"USAGE\", \"source\": \"TreeDecorator\", \"target\": \"ChristmasTree\"}, {\"type\":\"USAGE\", \"source\": \"BubbleLights\", \"target\": \"ChristmasTree\"}, {\"type\": \"IMPLEMENTS\", \"source\": \"ChristmasTree\", \"target\": \"ChristmasTreeImpl\"}, {\"type\": \"IMPLEMENTS\", \"source\": \"ChristmasTree\", \"target\": \"TreeDecorator\"}]}"