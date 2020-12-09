import {expect} from 'chai';

import { VPVariantsStrategy } from "../src/controller/parser/strategies/vp_variants.strategy";
import { District } from '../src/model/entities/district.interface';

function countBuilding(districts: District[]) : number{
  let sum = 0;
  districts.forEach(d => {
    sum += d.buildings.length;
    sum += countBuilding(d.districts)
  })
   return sum;
}

function countDistricts(districts: District[]) : number{
  let sum = 0;
  districts.forEach(d => {
    sum += 1;
    sum += countDistricts(d.districts)
  })
   return sum;
}

describe('parsing all tests projects with vp strategy', function() {
    it('parse abactract decorator', function() {
        let entities = new VPVariantsStrategy().parse('abstract_decorator');
        let ent = entities.filterCompLevel(1);
        let dis = ent.district.districts
        let numberOfDistricts = countDistricts(dis);
        let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
        expect(numberOfBuiildings).equal(4);
        expect(numberOfDistricts).equal(2);
    }); 
  
    it('parse composition_levels_inheritance', function() {
      let entities = new VPVariantsStrategy().parse('composition_levels_inheritance');
      let districts = entities.district.districts
    //   console.log('\n\n************\n\n')
    //   console.log(districts)
    //   let numberOfBuiildings = entities.district.districts[0].buildings.length
      let numberOfBuiildings = countBuilding(districts) + countDistricts(districts)
      expect(numberOfBuiildings).equal(1); // bizarre que le résulat soit 0
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(0);
    }); 
  
    // it('parse composition_levels_mixed', function() {
    //   let entities = new ClassesPackagesStrategy().parse('composition_levels_mixed');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(1);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // }); 
  
    it('parse decorator', function() {
      let entities = new VPVariantsStrategy().parse('decorator');
      let dis = entities.district.districts
    //   let numberOfDistricts = countDistricts(dis);
      let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
      expect(numberOfBuiildings).equal(4);
      let numberOfLinks = entities.links.length;
      expect(numberOfLinks).equal(5); // pourquoi 5 
    }); 
  
    // it('parse density', function() {
    //   let entities = new ClassesPackagesStrategy().parse('density');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(6);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(4);
    // });
  
    // it('parse factory', function() {
    //   let entities = new ClassesPackagesStrategy().parse('factory');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(4);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(2);
    // });
  
    // it('parse generic_decorator', function() {
    //   let entities = new ClassesPackagesStrategy().parse('generic_decorator');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(4);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(3);
    // });
  
    // it('parse attribute_composition', function() {
    //   let entities = new ClassesPackagesStrategy().parse('attribute_composition');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(1);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // });
  
    // it('parse attribute_composition_factory', function() {
    //   let entities = new ClassesPackagesStrategy().parse('attribute_composition_factory');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(10);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(9);
    // });
  
    // it('parse generics', function() {
    //   let entities = new ClassesPackagesStrategy().parse('generics');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(3);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(2);
    // });
  
    // it('parse inheritance', function() {
    //   let entities = new ClassesPackagesStrategy().parse('inheritance');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(3);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(2);
    // });
  
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
  
    // it('parse inner_class', function() {
    //   let entities = new ClassesPackagesStrategy().parse('inner_class');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(0);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // });
  
    // it('parse inner_class_before_fields', function() {
    //   let entities = new ClassesPackagesStrategy().parse('inner_class_before_fields');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(0);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // });
  
    // it('parse metrics', function() {
    //   let entities = new ClassesPackagesStrategy().parse('metrics');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(4);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // });
  
    // it('parse multiple_patterns', function() {
    //   let entities = new ClassesPackagesStrategy().parse('multiple_patterns');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(6);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(4);
    // });
  
    // it('parse multiple_vp', function() {
    //   let entities = new ClassesPackagesStrategy().parse('multiple_vp');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(1);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // });
  
    // it('parse strategy', function() {
    //   let entities = new ClassesPackagesStrategy().parse('strategy');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(3);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(2);
    // });
  
    // it('parse strategy_with_method_parameter', function() {
    //   let entities = new ClassesPackagesStrategy().parse('strategy_with_method_parameter');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(3);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(2);
    // });
  
    // it('parse structures', function() {
    //   let entities = new ClassesPackagesStrategy().parse('structures');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(3);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // });
  
    // it('parse template', function() {
    //   let entities = new ClassesPackagesStrategy().parse('template');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(2);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(1);
    // });
  
    // it('parse vps_and_variants', function() {
    //   let entities = new ClassesPackagesStrategy().parse('vps_and_variants');
    //   let numberOfBuiildings = entities.buildings.length;
    //   expect(numberOfBuiildings).equal(6);
    //   let numberOfLinks = entities.links.length;
    //   expect(numberOfLinks).equal(0);
    // });
  
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