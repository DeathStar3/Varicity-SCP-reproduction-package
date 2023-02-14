import { Building3D } from "./building3D";
import { ActionManager, ExecuteCodeAction, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { Building } from "../../../model/entities/building.interface";
import { Config } from "../../../model/entitiesImplems/config.model";
import {Building3DFactory} from "../3Dfactory/building3D.factory";

/**
 * This class represent a file and the classes that it exports.
 */
export class FileBuilding3D extends Building3D {
	private hat_city: Building3D[][] = [];
	private max_x: number = 5;
	private max_z: number = 5;

	private class_width: number = 1;

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
				if (x % 2 === 0 && z % 2 === 0) {
					const elem = elements.pop();
					this.hat_city[x].push(elem);

					this.class_width = Math.max(this.class_width, elem.getWidth());
				} else
					this.hat_city[x].push(undefined);
			}
		}

		if (elements)
			console.log("The classes ", elements, " were not included in the display for file ", this.elementModel.name);
	}

	build() {
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
		let old_types = Object.assign([], this.elementModel.types); // Save all the types that had the file
		this.elementModel.types = this.elementModel.types.filter(elem => elem !== "API"); // Remove API to not display a hat

		super.render();

		const r = this.elementModel.getWidth(this.config.variables.width) / 2;
		const inner_square_dim = 2 * r * Math.sin(Math.PI / 4);
		let offset_x = inner_square_dim / this.max_x;
		let offset_z = inner_square_dim / this.max_z;
		let x = this.center.x - inner_square_dim / 2;
		let z_i = this.center.z - inner_square_dim / 2;
		let z = z_i;

		const scale = offset_x / this.class_width * 3; // Multiplication by 3 to eat a bit of padding cells

		const meshes: Mesh[] = [];

		for (const line of this.hat_city) {
			for (const building of line) {
				if (building !== undefined) {
					building.place(x + (offset_x / 2), z + (offset_z / 2));
					building.render(this.config, scale);
					building.d3Model.translate(new Vector3(0, 1, 0), this.getHeight());
					meshes.push(building.d3Model);
				}
				z += offset_z;
			}
			z = z_i;
			x += offset_x;
		}

		this.d3Model = Mesh.MergeMeshes(
			[this.d3Model, ...meshes],
			true, true,
			undefined, false,
			true);

		this.elementModel.types = old_types; // Reset the types of the file

		this.d3Model.actionManager = new ActionManager(this.scene); // Reset this cause of the Merge
		this.d3Model.actionManager.registerAction(
			new ExecuteCodeAction(
				{
					trigger: ActionManager.OnPickTrigger
				},
				() => {
					this.flag = !this.flag;
					this.selectAndDisplayDetails(this.flag, this.flag);
				}
			)
		);
	}
}