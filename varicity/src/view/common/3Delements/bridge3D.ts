import { Link3D } from '../3Dinterfaces/link3D.interface';
import { Color3, Color4, Curve3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Building3D } from "./building3D";
import { Config } from "../../../model/entitiesImplems/config.model";

export class Bridge3D implements Link3D {
	scene: Scene;

	src: Building3D;
	dest: Building3D;
	type: string;

	force: boolean = false;

	config: Config;

	private mesh: Mesh;
	private material: StandardMaterial;
	private center: Vector3;

	constructor(src: Building3D, dest: Building3D, type: string, scene: Scene, config: Config) {
		this.src = src;
		this.dest = dest;
		this.type = type;
		this.scene = scene;
		this.config = config;
	}

	display(force?: boolean, show?: boolean) {
		if (force != undefined) this.force = force;
		if (!show && !this.force && this.mesh) {
			this.render(false);
		} else {
			if (show && ((force == undefined || this.force) && !this.mesh))
				this.render(true);
		}
	}

	private getName(): string {
		return this.src.elementModel.name + " => " + this.dest.elementModel.name
	}

	private createBridge(src: Vector3, dest: Vector3) {
		this.center = Vector3.Center(src, dest);

		let curve = Curve3.CreateQuadraticBezier(
			src,
			Vector3.Center(src, dest).add(new Vector3(0, Math.max(src.y, dest.y), 0)),
			dest,
			25
		);

		let colors = []
		for (const _ of curve.getPoints())
			colors.push(Color4.FromHexString("#335DFFFF"))

		this.mesh = MeshBuilder.CreateLines(
			this.getName(),
			{
				points: curve.getPoints(),
				colors: colors
			},
			this.scene
		)
	}

	render(display: boolean): void {
		if (display) {
			this.createBridge(this.src.center, this.dest.center);
		} else {
			this.mesh?.dispose();
			delete this.mesh;
		}
	}
}