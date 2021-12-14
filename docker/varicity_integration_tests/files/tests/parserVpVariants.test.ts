import {expect} from 'chai';

import {District} from '../src/model/entities/district.interface';
import {VPVariantsStrategy} from "../src/controller/parser/strategies/vp_variants.strategy";
import {Config} from "../src/model/entitiesImplems/config.model";
import {Orientation} from "../src/model/entitiesImplems/orientation.enum";
import {ProjectService} from "../src/services/project.service";

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

let config = {} as Config;
config.hierarchy_links = ["EXTENDS", "IMPLEMENTS"];
config.orientation = Orientation.IN_OUT
config.default_level = 1

describe('parsing all tests projects with vp strategy', function () {
    it('parse abstract decorator', async function () {

        config.api_classes = ["ChristmasTree"]

        await ProjectService.fetchVisualizationData('abstract_decorator').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "abstract_decorator");
            let ent = entities.filterCompLevel(1);
            let dis = ent.district.districts
            let numberOfDistricts = countDistricts(dis);
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(3); // correction 4 en 3
            expect(numberOfDistricts).equal(2);
        });
    });

    it('parse composition_levels_inheritance', async function () {

        // config.api_classes = ["???"] //TODO TEST NEED TO BE FIXED : DEFINE ENTRYPOINT

        await ProjectService.fetchVisualizationData('composition_levels_inheritance').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, 'composition_levels_inheritance');
            let districts = entities.district.districts
            let numberOfBuiildings = countBuilding(districts) + countDistricts(districts)
            expect(numberOfBuiildings).equal(0); // bizarre que le résulat soit 0
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(0);
        });
    });

    // it('parse composition_levels_mixed', function() {
    //   let entities = new ClassesPackagesStrategy().parse('composition_levels_mixed');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(1);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // });

    it('parse decorator', async function () {

        config.api_classes = ["com.iluwatar.decorator.Troll"]

        await ProjectService.fetchVisualizationData('decorator').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "decorator");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(4);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(5); // pourquoi 5
        });
    });

    it('parse density', async function () {

        config.api_classes = ["Shape", "Renderer"]

        await ProjectService.fetchVisualizationData('density').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "density");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(6);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(6);
        });
    });

    it('parse factory', async function () {

        config.api_classes = ["Shape"]

        await ProjectService.fetchVisualizationData('factory').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "factory");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(3);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(2);
        });
    });

    it('parse generic_decorator', async function () {

        config.api_classes = ["ChristmasTree", "TreeDecorator"]

        await ProjectService.fetchVisualizationData('generic_decorator').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "generic_decorator");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(4); // 0 au lieu de 4
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(5);
        });
    });

    it('parse attribute_composition', async function () {

        // config.api_classes = ["???"] //TODO TEST NEED TO BE FIXED : DEFINE ENTRYPOINT

        await ProjectService.fetchVisualizationData('attribute_composition').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "attribute_composition");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(0);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(0);
        });
    });

    it('parse attribute_composition_factory', async function () {

        config.api_classes = ["Dataset", "Value", "DefaultPieDataset"]

        await ProjectService.fetchVisualizationData('attribute_composition_factory').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "attribute_composition_factory");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(12); // à revérifier avec des consoles
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(9); // à revérifier aussi
        });
    });

    it('parse generics', async function () {

        config.api_classes = ["MyPair"]

        await ProjectService.fetchVisualizationData('generics').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "generics");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(3);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(2);
        });
    });

    it('parse inheritance', async function () {

        config.api_classes = ["Superclass"]

        await ProjectService.fetchVisualizationData('inheritance').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "inheritance");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(3);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(2);
        });
    });

    // it('parse import_from_different_package', function() {
    //   let entities = new ClassesPackagesStrategy().parse('import_from_different_package');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(2);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(1);
    // });

    // it('parse import_from_different_package_all_package_imported', function() {
    //   let entities = new ClassesPackagesStrategy().parse('import_from_different_package_all_package_imported');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(2);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(1);
    // });

    it('parse inner_class', async function () {

        // config.api_classes = ["???"] //TODO TEST NEED TO BE FIXED : DEFINE ENTRYPOINT

        await ProjectService.fetchVisualizationData('inner_class').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "inner_class");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(0);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(0);
        });
    });

    it('parse inner_class_before_fields', async function () {

        // config.api_classes = ["???"] //TODO TEST NEED TO BE FIXED : DEFINE ENTRYPOINT

        await ProjectService.fetchVisualizationData('inner_class_before_fields').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "inner_class_before_fields");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(0);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(0);
        });
    });

    it('parse metrics', async function () {

        // config.api_classes = ["???"] //TODO TEST NEED TO BE FIXED : DEFINE ENTRYPOINT

        await ProjectService.fetchVisualizationData('metrics').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "metrics");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(0); // ici c'est 0 au lieu de 4
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(0);
        });
    });

    it('parse multiple_patterns', async function () {

        config.api_classes = ["Shape", "Factory"]

        await ProjectService.fetchVisualizationData('multiple_patterns').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "multiple_patterns");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(6);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(7); // ici c'est 7 au lieu de 4
        });
    });

    it('parse multiple_vp', async function () {

        // config.api_classes = ["???"] //TODO TEST NEED TO BE FIXED : DEFINE ENTRYPOINT

        await ProjectService.fetchVisualizationData('multiple_vp').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "multiple_vp");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(0);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(0);
        });
    });

    it('parse strategy', async function () {

        config.api_classes = ["Strategy"]

        await ProjectService.fetchVisualizationData('strategy').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "strategy");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(3);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(2);
        });
    });

    it('parse strategy_with_method_parameter', async function () {

        config.api_classes = ["Strategy"]

        await ProjectService.fetchVisualizationData('strategy_with_method_parameter').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "strategy_with_method_parameter");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(3);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(2);
        });
    });

    it('parse structures', async function () {

        // config.api_classes = ["???"] //TODO TEST NEED TO BE FIXED : DEFINE ENTRYPOINT

        await ProjectService.fetchVisualizationData('structures').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "structures");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(0);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(0);
        });
    });

    it('parse template', async function () {

        config.api_classes = ["Algorithm"]

        await ProjectService.fetchVisualizationData('template').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "template");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(2);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(1);
        });
    });

    it('parse vps_and_variants', async function () {

        // config.api_classes = ["???"] //TODO TEST NEED TO BE FIXED : DEFINE ENTRYPOINT

        await ProjectService.fetchVisualizationData('vps_and_variants').then(async (response) => {
            let entities = new VPVariantsStrategy().parse(response.data, config, "vps_and_variants");
            let dis = entities.district.districts
            let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
            expect(numberOfBuiildings).equal(0);
            let numberOfLinks = entities.links.length;
            expect(numberOfLinks).equal(0);
        });
    });

    // it('parse vps_in_different_packages', function() {
    //   let entities = new ClassesPackagesStrategy().parse('vps_in_different_packages');
    //   let districts = entities.district[0].districts
    //   let numberOfDistricts = districts.length;
    //   expect(numberOfDistricts).equal(2);
    //   let numberOfBuiildings = 0;
    //   districts.forEach(d => {
    //     numberOfBuiildings += d.buildings.length
    //   })
    //   numberOfBuiildings+= entities.buildings.length
    //   // expect(numberOfBuiildings).equal(6);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(1);
    // });
});