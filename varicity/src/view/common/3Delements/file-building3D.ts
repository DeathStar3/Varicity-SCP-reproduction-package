import { Building3D } from "./building3D";
import { Mesh, MeshBuilder, Scene } from "@babylonjs/core";
import { Building } from "../../../model/entities/building.interface";
import { Config } from "../../../model/entitiesImplems/config.model";

/**
 * This class represent a file and the classes that it exports
 */
export class FileBuilding3D extends Building3D {
	private hat_city: Building3D[][] = [];
	private children: Building[] = [];

	constructor(scene: Scene, building: Building, depth: number, config: Config) {
		super(scene, building, depth, config);
	}

	build() {
		// No need for build phase ??
	}

	place(x: number, z: number) {
		super.place(x, z);
	}

	protected renderBaseElement(
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
		super.render();
	}
}