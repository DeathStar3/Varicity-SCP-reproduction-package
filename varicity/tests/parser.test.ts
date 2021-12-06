import {expect} from 'chai';
import {ClassesPackagesStrategy} from "../src/controller/parser/strategies/classes_packages.strategy";
import {Config} from "../src/model/entitiesImplems/config.model";
import {JsonInputInterface} from "../src/model/entities/jsonInput.interface";

describe('parsing without links', function () {
    it('parse', function () {
        const jsonInput = JSON.parse(test1WithoutLinks) as JsonInputInterface
        let entities = new ClassesPackagesStrategy().parse(jsonInput, {} as Config);
        let districts = entities.district.districts[0].districts[0].districts
        let numberOfDistricts = districts.length;
        expect(numberOfDistricts).equal(2);
        let numberOfBuildings = 0;
        districts.forEach(d => {
            numberOfBuildings += d.buildings.length
        })
        expect(numberOfBuildings).equal(5);
    });
});

describe('parsing links', function () {
    it('parse', function () {
        const jsonInput = JSON.parse(test2WithLinks) as JsonInputInterface
        let entities = new ClassesPackagesStrategy().parse(jsonInput, {} as Config);
        let numberOfLinks = entities.links.length;
        expect(numberOfLinks).equal(2);
    });
});


const test1WithoutLinks = "{\"nodes\": [{\"types\": [\"CLASS\"], \"name\":\"fr.polytech.varicity.class1\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.varicity.class2\", \"number\": 1}]}, {\"types\": [\"CLASS\"], \"name\":\"fr.polytech.varicity.class2\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.varicity.class1\", \"number\": 1}]}, {\"types\": [\"CLASS\"], \"name\":\"fr.polytech.d3.class1\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.d3.class2\", \"number\": 1}]}, {\"types\": [\"CLASS\"], \"name\":\"fr.polytech.d3.class2\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.d3.class1\", \"number\": 1}]}, {\"types\": [\"CLASS\"], \"name\":\"fr.polytech.d3.class3\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.varicity.class1\", \"number\": 1}]}], \"links\": []}"
const test2WithLinks = "{\"nodes\": [{\"types\": [\"CLASS\"], \"name\":\"fr.polytech.varicity.class1\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.varicity.class2\", \"number\": 1}]}, {\"types\": [\"CLASS\"], \"name\":\"fr.polytech.varicity.class2\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.varicity.class1\", \"number\": 1}]}, {\"types\": [\"CLASS\"], \"name\":\"fr.polytech.d3.class1\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.d3.class2\", \"number\": 1}]}, {\"types\": [\"CLASS\"], \"name\":\"fr.polytech.d3.class2\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.d3.class1\", \"number\": 1}]}, {\"types\": [\"CLASS\"], \"name\":\"fr.polytech.d3.class3\", \"methodVariants\": 5, \"constructorVariants\": 10, \"nbAttributes\": 5, \"attributes\": [{\"name\": \"fr.polytech.varicity.class1\", \"number\": 1}]}], \"links\": [{\"source\":\"fr.polytech.varicity.class1\", \"target\":\"fr.polytech.varicity.class2\", \"type\": \"EXTENDS\"}, {\"source\":\"fr.polytech.d3.class3\", \"target\":\"fr.polytech.varicity.class3\", \"type\": \"EXTENDS\"}]}"
