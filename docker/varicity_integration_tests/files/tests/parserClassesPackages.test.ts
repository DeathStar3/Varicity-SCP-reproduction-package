import {expect} from 'chai';

import {ClassesPackagesStrategy} from "../src/controller/parser/strategies/classes_packages.strategy";
import {District} from '../src/model/entities/district.interface';
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

describe('parsing all tests projects with classe packages strategy', function () {
  it('parse abactract decorator', async function () {

    config.api_classes = ["ChristmasTree"]

    await ProjectService.fetchVisualizationData('abstract_decorator').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(4);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(3);
    });
  });

  it('parse composition_levels_inheritance', async function () {

    config.api_classes = ["Composed2"]

    await ProjectService.fetchVisualizationData('composition_levels_inheritance').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(1);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse composition_levels_mixed', async function () {

    config.api_classes = ["Composed2"]

    await ProjectService.fetchVisualizationData('composition_levels_mixed').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(1);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse decorator', async function () {

    config.api_classes = ["com.iluwatar.decorator.Troll"]

    await ProjectService.fetchVisualizationData('decorator').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let districts = entities.district.districts[0].districts
      let numberOfBuiildings = countBuilding(districts)
      expect(numberOfBuiildings).equal(4);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(3);
    });
  });

  it('parse density', async function () {

    config.api_classes = ["Shape", "Renderer"]

    await ProjectService.fetchVisualizationData('density').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(6);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(4);
    });
  });

  it('parse factory', async function () {

    config.api_classes = ["Shape"]

    await ProjectService.fetchVisualizationData('factory').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(4);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(2);
    });
  });

  it('parse generic_decorator', async function () {

    config.api_classes = ["ChristmasTree", "TreeDecorator"]

    await ProjectService.fetchVisualizationData('generic_decorator').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(4);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(3);
    });
  });

  it('parse attribute_composition', async function () {

    config.api_classes = ["C"]

    await ProjectService.fetchVisualizationData('attribute_composition').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(1);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse attribute_composition_factory', async function () {

    config.api_classes = ["Dataset", "Value", "DefaultPieDataset"]

    await ProjectService.fetchVisualizationData('attribute_composition_factory').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(10);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(9);
    });
  });

  it('parse generics', async function () {

    config.api_classes = ["MyPair"]

    await ProjectService.fetchVisualizationData('generics').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(3);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(2);
    });
  });

  it('parse inheritance', async function () {

    config.api_classes = ["Superclass"]

    await ProjectService.fetchVisualizationData('inheritance').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(3);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(2);
    });
  });

  it('parse import_from_different_package', async function () {

    config.api_classes = ["abs.AbstractAlgo"]

    await ProjectService.fetchVisualizationData('import_from_different_package').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(1);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(1);
    });
  });

  it('parse import_from_different_package_all_package_imported', async function () {

    config.api_classes = ["abs.AbstractAlgo"]

    await ProjectService.fetchVisualizationData('import_from_different_package_all_package_imported').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(1);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(1);
    });
  });

  it('parse inner_class', async function () {

    // config.api_classes = ["???"] // No entry point can be found

    await ProjectService.fetchVisualizationData('inner_class').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(0);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse inner_class_before_fields', async function () {

    // config.api_classes = ["???"] // No entry point can be found

    await ProjectService.fetchVisualizationData('inner_class_before_fields').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(0);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse metrics', async function () {

    config.api_classes = ["OneMethodOverload", "TwoConstructorOverloads", "TwoMethodOverloads", "OneConstructorOverload"]

    await ProjectService.fetchVisualizationData('metrics').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(4);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse multiple_patterns', async function () {

    config.api_classes = ["Shape", "Factory"]

    await ProjectService.fetchVisualizationData('multiple_patterns').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(6);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(4);
    });
  });

  it('parse multiple_vp', async function () {

    config.api_classes = ["Strategy"]

    await ProjectService.fetchVisualizationData('multiple_vp').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(1);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse strategy', async function () {

    config.api_classes = ["Strategy"]

    await ProjectService.fetchVisualizationData('strategy').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(3);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(2);
    });
  });

  it('parse strategy_with_method_parameter', async function () {

    config.api_classes = ["Strategy"]

    await ProjectService.fetchVisualizationData('strategy_with_method_parameter').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(3);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(2);
    });
  });

  it('parse structures', async function () {

    config.api_classes = ["Algorithm"]

    await ProjectService.fetchVisualizationData('structures').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(3);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse template', async function () {

    config.api_classes = ["Algorithm"]

    await ProjectService.fetchVisualizationData('template').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(2);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(1);
    });
  });

  it('parse vps_and_variants', async function () {

    config.api_classes = ["NoConstructorTwoMethods", "OneConstructorOneMethod", "OneConstructorTwoMethods", "TwoConstructorsNoMethod", "TwoConstructorsOneMethod", "TwoConstructorsTwoMethods"]

    await ProjectService.fetchVisualizationData('vps_and_variants').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let numberOfBuiildings = entities.buildings.length;
      expect(numberOfBuiildings).equal(6);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    });
  });

  it('parse vps_in_different_packages', async function () {

    config.api_classes = ["abs.AbstractAlgo"]

    await ProjectService.fetchVisualizationData('vps_in_different_packages').then(async (response) => {
      let entities = new ClassesPackagesStrategy().parse(response.data, config);
      let districts = entities.district.districts
      let numberOfBuiildings = countBuilding(districts) + countDistricts(districts) // à revérifier
      expect(numberOfBuiildings).equal(6);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(1);
    });
  });
});