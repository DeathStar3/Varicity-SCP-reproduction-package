import {Node} from './../parser/symfinder_elements/nodes/node.element';
import {Building3D} from './../../view/common/3Delements/building3D';
import {Metrics} from "../../model/entitiesImplems/metrics.model";

export class SearchbarController {
    private static map: Map<string, Building3D>;

    public static initMap() {
        this.map = new Map<string, Building3D>();

        /* @ts-ignore */
        let searchbar: HTMLInputElement = document.getElementById("searchbar");
        let searchbarBox = document.getElementById("searchbar-box");
        searchbar.style.display = "block";
        searchbar.setAttribute("previous", "");

        let datalist = document.createElement("datalist");
        datalist.id = "datalist";
        datalist.style.maxHeight = "80px";
        datalist.style.overflowY = "scroll";

        searchbar.appendChild(datalist);
        searchbar.setAttribute("list", "datalist");

        let searchbarBtn = document.getElementById("searchbar-btn");
        searchbarBtn.addEventListener("click", (ev) => {
            // recherche and destroy
            if (searchbar.placeholder === "" && !this.map.has(searchbar.value)) { // the search key doesn't exist
                searchbarBox.style.border = "2px solid red";
            } else {
                if (this.map.has(searchbar.value)) { // we take the value because it exists
                    this.map.get(searchbar.value).focus();
                } else { // we take the placeholder
                    this.map.get(searchbar.placeholder).focus();
                }
                searchbarBox.style.border = "2px solid #e9ecef";
                return;
            }
        });

        searchbar.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                // recherche and destroy
                if (searchbar.placeholder === "" && !this.map.has(searchbar.value)) { // the search key doesn't exist
                    searchbarBox.style.border = "2px solid red";
                } else {
                    if (this.map.has(searchbar.value)) { // we take the value because it exists
                        this.map.get(searchbar.value).focus();
                    } else { // we take the placeholder
                        this.map.get(searchbar.placeholder).focus();
                    }
                    searchbarBox.style.border = "2px solid #e9ecef";
                    return;
                }
            } else {
                for (let [k, v] of this.map) {
                    if (k.includes(searchbar.value)) {
                        searchbar.placeholder = k;
                        searchbarBox.style.border = "2px solid #e9ecef";

                        // NOT YET IMPLEMENTED : HIGHLIGHTS BUILDING OF NAME BEING TYPED
                        let prev = searchbar.getAttribute("previous");
                        if (prev != "" && this.map.has(prev)) {
                            this.map.get(prev).highlight(false);
                        }
                        searchbar.setAttribute("previous", k);
                        v.highlight(true);
                        return;
                    }
                }
                searchbar.placeholder = "";
                searchbarBox.style.border = "2px solid red";
            }
        });

        let datalist2 = document.createElement("datalist");
        datalist2.id = "attributelist";
        datalist2.style.display = "none";

        const nodeKeys: Node = {
            name: "",
            types: [],
            metrics: new Metrics()
        }
        for (let key in nodeKeys) {
            if (typeof nodeKeys[key] === "number") {
                let opt = document.createElement("option");
                opt.innerHTML = key;
                datalist2.appendChild(opt);
            }
        }

        searchbar.appendChild(datalist2);
    }

    public static emptyMap() {
        this.map.clear();

        let datalist = document.getElementById("datalist");

        while (datalist.firstChild) {
            datalist.removeChild(datalist.lastChild);
        }
    }

    public static addEntry(key: string, building: Building3D) {
        this.map.set(key, building);

        // niveau opti on a vu mieux mais sort the keys
        // this.map = new Map<string, Building3D>([...this.map.entries()].sort());

        let datalist = document.getElementById("datalist");
        let option = document.createElement("option");
        option.innerHTML = key;
        datalist.appendChild(option);
    }
}
