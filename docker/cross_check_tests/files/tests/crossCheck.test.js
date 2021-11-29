
import { ConfigLoader } from '../src/controller/parser/configLoader';
import { FilesLoader } from '../src/controller/parser/filesLoader';
import { VPVariantsStrategy } from "../src/controller/parser/strategies/vp_variants.strategy";
import * as fs from 'fs';

function countBuilding(districts){
  let sum = 0;
  districts.forEach(d => {
    sum += d.buildings.length;
    sum += countBuilding(d.districts)
  })
   return sum;
}

function countDistricts(districts) {
  let sum = 0;
  districts.forEach(d => {
    sum += 1;
    sum += countDistricts(d.districts)
  })
   return sum;
}

function loadProject(projectPath) {
    return JSON.parse(fs.readFileSync(projectPath, 'utf8'))
}

describe('cross check', function() {
  
  beforeAll(async () => {
    await display("symfinder_files/cross_check_1.json", "symfinder_files/cross_check_1-stats.json", [], ["JfreeChart"], 1, "IN-OUT");
    setTimeout(() => done(), 500); // wait for onclick event to execute totally
  });

  it('cross check cross_check_1', function() {
      let entities = new VPVariantsStrategy().parse(this.loadProject('symfinder_files/cross_check_1.json'), ConfigLoader.loadDataFile("config"), "cross_check_1");
      let ent = entities.filterCompLevel(1);
      let dis = ent.district.districts
      let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
      expect(numberOfBuiildings).toBe(22);
  });
  it('the generated graph should contain 22 nodes', async () => {
      expect(d3.selectAll('circle').size()).toBe(22); // 14 au lieu de 22
  });
})
