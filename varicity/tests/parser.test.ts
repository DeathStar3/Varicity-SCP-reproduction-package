import { expect } from 'chai';
import { ConfigLoader } from "../src/controller/parser/configLoader";
import { ClassesPackagesStrategy } from "../src/controller/parser/strategies/classes_packages.strategy";
import { ProjectService } from '../src/services/project.service';


describe('parsing without links', function () {
  it('parse', async function () {
    let entities = new ClassesPackagesStrategy().parse((await ProjectService.fetchVisualizationData('test1WithoutLinks')).data,
      (await ConfigLoader.loadDataFile("config")).data);
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
  it('parse', async function () {
    let entities = new ClassesPackagesStrategy().parse((await ProjectService.fetchVisualizationData('test2WithLinks')).data, (await ConfigLoader.loadDataFile("config")).data);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  });
});