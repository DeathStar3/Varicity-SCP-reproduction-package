import { Building } from "../entities/building.interface";
import { District } from "../entities/district.interface";

export class JsDistrict extends District {
    addDistrict(district: District) {
        return this.districts.push(district);
    }

    addBuilding(building: Building) {
        return this.buildings.push(building);
    }

    getTotalWidth(): number {
        return 0;
    }

    hasChild(): boolean {
        // todo
        return false;
    }

    filterCompLevel(): District | [District[], Building[]] {
        return this;
    }
}