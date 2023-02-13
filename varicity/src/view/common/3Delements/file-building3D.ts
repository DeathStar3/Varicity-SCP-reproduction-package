import { Building3D } from "./building3D";
import {Mesh, MeshBuilder, Scene, Vector3} from "@babylonjs/core";
import { Building } from "../../../model/entities/building.interface";
import { Config } from "../../../model/entitiesImplems/config.model";
import {Building3DFactory} from "../3Dfactory/building3D.factory";

/**
 * This class represent a file and the classes that it exports
 */
export class FileBuilding3D extends Building3D {
	private hat_city: Building3D[][] = [];
	private max_x: number = 5;
	private max_z: number = 5;

	constructor(scene: Scene, building: Building, depth: number, config: Config) {
		super(scene, building, depth, config);
	}

	/*
	1 2 3 4 5 6 7 8 9
	1 1 2 2 3 3 4 4 5
	x / 2 + x % 2;

	 */

	private placeClasses() {
		const elements = this.elementModel.exportedClasses.map(model => Building3DFactory.createBuildingMesh(model as Building, 0, this.scene, this.config));
		elements.sort((a: Building3D, b: Building3D) => a.getHeight() - b.getHeight())
		for (let x = 0; x < this.max_x; x++) {
			this.hat_city.push([])
			for (let z = 0; z < this.max_z; z++) {
				if (x % 2 === 0 && z % 2 === 0)
					this.hat_city[x].push(elements.pop());
				else
					this.hat_city[x].push(undefined);
			}
		}

		console.log("The classes ", elements, " were not included in the display for file ", this.elementModel.name);
	}

	build() {
		console.log("[", this.elementModel.name, "] Exported classes: ", this.elementModel.exportedClasses)
		const length = this.elementModel.exportedClasses.length;
		// nb = (n/2)^2
		let dim = Math.floor(Math.sqrt(length)) * 2;
		dim = dim % 2 == 0 ? dim - 1 : dim;
		this.max_x = this.max_z = dim;
		this.placeClasses();
		// No need for build phase ??
	}

	place(x: number, z: number) {
		super.place(x, z);
	}

	protected renderBaseElement(
		scale : number = 1,
		sideOrientation: number = Mesh.DEFAULTSIDE,
		updatable: boolean = false
	): Mesh {
		console.log("File render for ", this.elementModel.name);
		return MeshBuilder.CreateCylinder(
			this.elementModel.name,
			{
				height: this.getHeight(),
				diameter: this.elementModel.getWidth(this.config.variables.width),
				sideOrientation: sideOrientation,
				updatable: updatable
			},
			this.scene
		);
	}

	render() {
		const scale = 0.8;

		let old_types = Object.assign([], this.elementModel.types);
		this.elementModel.types = this.elementModel.types.filter(elem => elem !== "API")

		super.render();
		console.log("Matrix : ",this.hat_city);
		let offset_x = this.elementModel.getWidth(this.config.variables.width) / this.max_x + 0.5;
		let offset_z = this.elementModel.getWidth(this.config.variables.width) / this.max_z + 0.5;
		let x = this.center.x - this.elementModel.getWidth(this.config.variables.width) / 2;
		let z = this.center.z - this.elementModel.getWidth(this.config.variables.width) / 2;
		for (const line of this.hat_city) {
			for (const building of line) {
				if (building !== undefined) {
					building.place(x + (offset_x / 2), z + (offset_z / 2));
					building.render(this.config, scale);
					building.d3Model.translate(new Vector3(0, 1, 0), this.getHeight());
					Mesh.MergeMeshes(
						[this.d3Model, building.d3Model],
						false, false,
						undefined, false,
						true);
				}
				z += offset_z;
			}
			x += offset_x;
		}

		this.elementModel.types = old_types;
	}
}