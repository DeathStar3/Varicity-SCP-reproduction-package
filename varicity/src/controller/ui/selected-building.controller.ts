import Cookies from "js-cookie";
import { Building } from "../../model/entities/building.interface";

export const SelectedBuildingController = {
    selected: [],
    selectABuilding: function(building: Building) {
        if (!this.selected.includes(building.name)) {
            this.selected.push(building.name);
        }
        this.display();
    },
    unselectABuilding: function (building: Building) {
        const index = this.selected.indexOf(building.name);
        this.selected.splice(index, 1);
        this.display();
    },
    display: function () {
        Cookies.set('selected-buildings', this.selected.join(','), {sameSite: 'strict'});
    }
}
