import { expect } from 'chai';
import { ConfigLoader } from "../src/controller/parser/configLoader";
import { VPVariantsStrategy } from "../src/controller/parser/strategies/vp_variants.strategy";
import { District } from '../src/model/entities/district.interface';
import { Orientation } from "../src/model/entitiesImplems/orientation.enum";
import { ProjectService } from '../src/services/project.service';


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
describe('parsing without filtering by composition level', function() {
  it('parse', async function() {
    let config = (await ConfigLoader.loadDataFile("config")).data;
    config.hierarchy_links = ["EXTENDS", "IMPLEMENTS"];
    let entities = new VPVariantsStrategy().parse((await ProjectService.fetchVisualizationData('test3ForVPParser')).data, config, "");
    let dis = entities.district.districts
    let numberOfDistricts = countDistricts(dis);
    let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
    expect(numberOfBuiildings).equal(4);
    expect(numberOfDistricts).equal(2);
  }); 
});

describe('parsing with filtering by composition level', function() {
  it('parse', async function() {
    let config = (await ConfigLoader.loadDataFile("config")).data;
    config.hierarchy_links = ["EXTENDS", "IMPLEMENTS"];
    config.orientation = Orientation.IN_OUT;

    let entities = new VPVariantsStrategy().parse( (await ProjectService.fetchVisualizationData('test3ForVPParser')).data, config, "");
    let ent = entities.filterCompLevel(1);
    let dis = ent.district.districts
    let numberOfDistricts = countDistricts(dis);
    let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
    expect(numberOfBuiildings).equal(3); //correction 3 en 4
    expect(numberOfDistricts).equal(2);
  }); 
});