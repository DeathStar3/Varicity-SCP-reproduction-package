import {UIController} from '../../../controller/ui/ui.controller';
import {Config, MetricSpec} from '../../../model/entitiesImplems/config.model';
import {Element3D} from '../3Dinterfaces/element3D.interface';
import {
    ActionManager,
    Color3,
    Color4,
    ExecuteCodeAction,
    HighlightLayer,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    Vector3
} from '@babylonjs/core';
import {Building} from '../../../model/entities/building.interface';
import {Link3D} from '../3Dinterfaces/link3D.interface';
import {MenuController} from "../../../controller/ui/menu/menu.controller";
import {SceneRenderer} from "../../sceneRenderer";
import {DetailsController} from "../../../controller/ui/menu/details.controller";
import {SelectedBuildingController} from "../../../controller/ui/selected-building.controller";

export class Building3D extends Element3D {
    elementModel: Building;

    depth: number;

    center: Vector3;
    top: Vector3;
    bot: Vector3;

    d3ModelOutline: Mesh;
    d3ModelPyramid: Mesh = undefined;
    d3ModelChimney1: Mesh = undefined;
    d3ModelChimney2: Mesh = undefined;
    d3ModelChimney3: Mesh = undefined;
    d3ModelPrism: Mesh = undefined;
    d3ModelInvertedPyramid: Mesh = undefined;
    d3ModelSphere: Mesh = undefined;

    links: Link3D[] = [];

    padding = 0.2;
    heightScale = 0.3;
    outlineWidth = 0.05;

    edgesWidth: number = 7.0;

    highlightLayer: HighlightLayer;
    highlightForce: boolean;

    config: Config;

    flag: boolean = false;

    constructor(scene: Scene, buildingElement: Building, depth: number, config: Config) {
        super(scene);
        this.elementModel = buildingElement;
        this.depth = depth;
        this.config = config;
        this.padding = config.building.padding;
    }

    showAllLinks(status?: boolean) {
        if (status == undefined) this.links.forEach(l => l.display());
        else this.links.forEach(l => l.display(status));
    }

    getWidth(): number {
        return this.elementModel.getWidth(this.config.variables.width) + this.padding; // 2.5 av 2.5 ap
        // return this.elementModel.getWidth();// 2.5 av 2.5 ap
    }

    getLength(): number {
        return this.getWidth();
    }

    getHeight(): number {
        return this.elementModel.getHeight(this.config.variables.height) * this.heightScale;
    }

    getName() {
        return this.elementModel.name;
    }

    link(link: Link3D) {
        this.links.push(link);
    }

    highlight(arg: boolean, force: boolean = false) {
        if (force) this.highlightForce = arg;
        if (!arg && !this.highlightForce) {
            this.highlightLayer.removeAllMeshes();
            // this.highlightLayer.dispose();
            // delete this.highlightLayer;
        } else {
            // if (this.highlightLayer) this.highlightLayer.removeAllMeshes();
            this.highlightLayer.addMesh(this.d3Model, Color3.Blue());
        }
    }

    focus(openInfo: boolean = true) {
        let cam = SceneRenderer.camera;
        cam.focusOn([this.d3Model], true);
        cam.radius = 20;

        this.flag = true;
        this.selectAndDisplayDetails(this.flag, openInfo);
    }

    private selectAndDisplayDetails(flag, openInfo: boolean = true) {
        if (flag) {
            SelectedBuildingController.selectABuilding(this.elementModel);
        } else {
            SelectedBuildingController.unselectABuilding(this.elementModel);
        }

        // Highlight the building.
        this.highlight(flag, true);

        // Display the links.
        this.links.forEach(l => l.display(flag, flag));

        if (openInfo) {
            // Display the submenu.
            document.getElementById("submenu").style.display = "block";

            // Deselect the current tab.
            const infoTab = DetailsController.getInformationTab();
            if (MenuController.selectedTab && MenuController.selectedTab !== infoTab) {
                const currentTab = document.getElementById(MenuController.selectedTab.id)
                MenuController.changeImage(currentTab) // Remove tab icon except if Information tab
            }

            // Select the information tab.
            if (!MenuController.selectedTab || MenuController.selectedTab !== infoTab) {
                MenuController.changeImage(infoTab) // Set Information tab icon to selected
            }
            MenuController.selectedTab = infoTab;
        }else {
            MenuController.closeMenu();
        }

        // Update the object information.
        UIController.displayObjectInfo(this, flag ? flag : undefined);
    }

    build() {
    }

    place(x: number, z: number) {
        const increaseHeight = ["API", "FACTORY", "DECORATOR", "TEMPLATE", "STRATEGY"];
        let halfHeight = this.getHeight() / 2;
        this.center = new Vector3(x, halfHeight + this.depth * 30, z);
        this.bot = this.center.add(new Vector3(0, -halfHeight, 0));
        // if (this.elementModel.types.includes("API")) {
        //     halfHeight += this.getWidth() - this.padding;
        // }
        this.elementModel.types.forEach(t => {
            if (increaseHeight.includes(t)) {
                halfHeight += this.getWidth() - this.padding;
            }
        });
        this.top = this.center.add(new Vector3(0, halfHeight, 0));
    }

    render() {
        // Display building
        this.d3Model = MeshBuilder.CreateBox(
            this.elementModel.name,
            {
                height: this.getHeight(),
                width: this.elementModel.getWidth(this.config.variables.width),
                depth: this.elementModel.getWidth(this.config.variables.width)
            },
            this.scene);
        this.d3Model.setPositionWithLocalVector(this.center);

        this.highlightLayer = new HighlightLayer("hl", this.scene);

        // if config -> building -> colors -> outline is defined
        if (this.config.building.colors.outlines) {
            const outlineColor = this.getColor(this.config.building.colors.outlines, this.elementModel.types);
            if (outlineColor !== undefined) {
                this.d3ModelOutline = MeshBuilder.CreateBox(
                    this.elementModel.name,
                    {
                        height: this.getHeight() + this.outlineWidth,
                        width: this.elementModel.getWidth(this.config.variables.width) + this.outlineWidth,
                        depth: this.elementModel.getWidth(this.config.variables.width) + this.outlineWidth,
                        sideOrientation: Mesh.BACKSIDE,
                        updatable: false
                    },
                    this.scene);
                let outlineMat = new StandardMaterial('outlineMaterial', this.scene);
                this.d3ModelOutline.material = outlineMat;
                this.d3ModelOutline.parent = this.d3Model;
                outlineMat.diffuseColor = Color3.FromHexString(outlineColor);
                outlineMat.emissiveColor = Color3.FromHexString(outlineColor);
            } else {
                this.d3Model.renderOutline = false;
            }
        } else {
            this.d3Model.renderOutline = false;
        }

        let mat = new StandardMaterial(this.elementModel.name + "Mat", this.scene);
        if (this.config.force_color) {
            mat.ambientColor = Color3.FromHexString(this.config.force_color);
            mat.diffuseColor = Color3.FromHexString(this.config.force_color);
            mat.emissiveColor = Color3.FromHexString(this.config.force_color);
            mat.specularColor = Color3.FromHexString("#000000");
        } else {
            if (this.config.building.colors.faces) {
                const buildingColor = this.getColor(this.config.building.colors.faces, this.elementModel.types);
                if (buildingColor !== undefined) {
                    mat.ambientColor = Color3.FromHexString(buildingColor);
                    mat.diffuseColor = Color3.FromHexString(buildingColor);
                    mat.emissiveColor = Color3.FromHexString(buildingColor);
                    mat.specularColor = Color3.FromHexString("#000000");
                } else {
                    mat.ambientColor = new Color3(1, 0, 0);
                    mat.diffuseColor = new Color3(1, 0, 0);
                    mat.emissiveColor = new Color3(1, 0, 0);
                    mat.specularColor = new Color3(0, 0, 0);
                }
            } else {
                mat.ambientColor = new Color3(1, 0, 0);
                mat.diffuseColor = new Color3(1, 0, 0);
                mat.emissiveColor = new Color3(1, 0, 0);
                mat.specularColor = new Color3(0, 0, 0);
            }
        }

        // console.log("BUILDING CITY METRICS SPEC", UIController.config.metrics)

        // New way to display a metric: city fade
        if (this.config.variables.fade && this.config.variables.fade != "") {
            if (this.elementModel.metrics.metrics.has(this.config.variables.fade)) { //Check if the metric wanted exist
                const metricValue = this.elementModel.metrics.metrics.get(this.config.variables.fade).value;

                const configSpec = UIController.config.metrics.get(this.config.variables.fade) || new MetricSpec();
                let fade = this.normalize(metricValue, configSpec.max, configSpec.min, 0, 1);
                if (configSpec.higherIsBetter) {
                    fade = 1 - fade;
                }

                var hue = ((1 - fade) * 120);
                let rgb = this.hsl2Rgb(Math.max(hue / 360, 0), 1, 0.5);

                mat.emissiveColor = new Color3(rgb[0], rgb[1], rgb[2])
                mat.diffuseColor = new Color3(rgb[0] / 2, rgb[1] / 2, rgb[2] / 2)
                mat.ambientColor = new Color3(0, 0, 0)
            } else {
                mat.ambientColor = Color3.FromHexString("#555555");
                mat.diffuseColor = Color3.FromHexString("#555555");
                mat.emissiveColor = Color3.FromHexString("#555555");
            }
        }

        // New way to display a metric: building opacity
        if (this.config.variables.intensity && this.config.variables.intensity != "") {
            if (this.elementModel.metrics.metrics.has(this.config.variables.intensity)) { //Check if the metric wanted exist
                const metricValue = this.elementModel.metrics.metrics.get(this.config.variables.intensity).value;

                const configSpec = UIController.config.metrics.get(this.config.variables.intensity) || new MetricSpec();
                let intensity = 1 - this.normalize(metricValue, configSpec.max, configSpec.min, 0, 0.93);
                if (configSpec.higherIsBetter) {
                    intensity = 1 - intensity;
                }

                let hsv = this.rgb2Hsv(mat.emissiveColor.r, mat.emissiveColor.g, mat.emissiveColor.b)
                let rgb = this.hsv2Rgb(hsv[0], hsv[1], intensity)

                mat.ambientColor = new Color3(rgb[0], rgb[1], rgb[2])
                mat.diffuseColor = new Color3(rgb[0], rgb[1], rgb[2])
                mat.emissiveColor = new Color3(rgb[0], rgb[1], rgb[2])
            }
        }

        // New way to display a metric: building cracks
        if (this.config.variables.crack && this.config.variables.crack !== "") {
            console.log("this.config.variables.crack", this.config.variables.crack);

            //TODO White color is absorbed find how to fix it:
            // See Spike #81 https://github.com/DeathStar3-projects/varicity-config/issues/81
            let color = "" //(rgbToYIQ(mat.emissiveColor.r, mat.emissiveColor.g, mat.emissiveColor.b) >= 128) ? "" : "w_"

            if (this.elementModel.metrics.metrics.has(this.config.variables.crack)) { //Check if the metric wanted exist
                const metricValue = this.elementModel.metrics.metrics.get(this.config.variables.crack).value;

                const configSpec = UIController.config.metrics.get(this.config.variables.crack) || new MetricSpec();
                let crack = this.normalize(metricValue, configSpec.max, configSpec.min, 0, 1);
                if (configSpec.higherIsBetter) {
                    crack = 1 - crack;
                }

                const numberOfLevels = 8;
                const level = Math.floor(crack * numberOfLevels);
                if (level > 0 && level < 8) {
                    mat.diffuseTexture = new Texture("./images/visualization-texture/crack/" + color + "level" + level + ".png", this.scene);
                } else if (level >= 8) {
                    mat.diffuseTexture = new Texture("./images/visualization-texture/crack/" + color + "level" + 7 + ".png", this.scene);
                }
            } else {
                mat.diffuseTexture = new Texture("./images/visualization-texture/crack/" + color + "cross_3.png", this.scene);
            }
        }

        //source: https://betterprogramming.pub/generate-contrasting-text-for-your-random-background-color-ac302dc87b4
        function rgbToYIQ(r, g, b): number {
            return ((r * 299) + (g * 587) + (b * 114)) / 1000;
        }

        this.d3Model.material = mat;

        let offSet = 0;

        // draw sphere for decorator
        if (this.elementModel.types.includes("DECORATOR")) {
            this.d3ModelSphere = MeshBuilder.CreateSphere("sphere", {
                diameter: (this.getWidth() - this.padding),
            }, this.scene);
            this.d3ModelSphere.setPositionWithLocalVector(this.center.add(new Vector3(0, offSet + this.getHeight() / 2 + (this.getWidth() - this.padding) / 2, 0)));
            this.d3ModelSphere.material = mat;
            this.d3ModelSphere.material.backFaceCulling = false;
            offSet += this.getWidth() - this.padding;
            this.d3Model = Mesh.MergeMeshes([this.d3Model, this.d3ModelSphere], true);
        }

        // draw reversed pyramid for template
        if (this.elementModel.types.includes("TEMPLATE")) {
            this.d3ModelInvertedPyramid = MeshBuilder.CreateCylinder("reversedPyramid", {
                diameterTop: 0,
                tessellation: 4,
                diameterBottom: this.getWidth() - this.padding,
                height: this.getWidth() - this.padding
            }, this.scene);
            this.d3ModelInvertedPyramid.setPositionWithLocalVector(this.center.add(new Vector3(0, offSet + this.getHeight() / 2 + (this.getWidth() - this.padding) / 2, 0)));
            this.d3ModelInvertedPyramid.rotate(new Vector3(1, 0, 0), Math.PI);
            this.d3ModelInvertedPyramid.rotate(new Vector3(0, 1, 0), Math.PI / 4);
            this.d3ModelInvertedPyramid.material = mat;
            this.d3ModelInvertedPyramid.material.backFaceCulling = false;
            offSet += this.getWidth() - this.padding;
            this.d3Model = Mesh.MergeMeshes([this.d3Model, this.d3ModelInvertedPyramid], true);
        }

        // draw 16 faced prism for strategy
        if (this.elementModel.types.includes("STRATEGY")) {
            this.d3ModelPrism = MeshBuilder.CreateCylinder("prism", {
                tessellation: 8,
                diameter: (this.getWidth() - this.padding),
                height: this.getWidth() - this.padding
            }, this.scene);
            this.d3ModelPrism.setPositionWithLocalVector(this.center.add(new Vector3(0, offSet + this.getHeight() / 2 + (this.getWidth() - this.padding) / 2, 0)));
            this.d3ModelPrism.material = mat;
            this.d3ModelPrism.material.backFaceCulling = false;
            offSet += this.getWidth() - this.padding;
            this.d3Model = Mesh.MergeMeshes([this.d3Model, this.d3ModelPrism], true);
        }

        // draw chimney for factories
        if (this.elementModel.types.includes("FACTORY")) {
            this.d3ModelChimney1 = MeshBuilder.CreateCylinder("chimney1", {
                diameter: (this.getWidth() - this.padding) / 6,
                height: this.getWidth() - this.padding
            }, this.scene);
            this.d3ModelChimney2 = MeshBuilder.CreateCylinder("chimney2", {
                diameter: (this.getWidth() - this.padding) / 6,
                height: this.getWidth() - this.padding
            }, this.scene);
            this.d3ModelChimney3 = MeshBuilder.CreateCylinder("chimney3", {
                diameter: (this.getWidth() - this.padding) / 6,
                height: this.getWidth() - this.padding
            }, this.scene);
            this.d3ModelChimney1.setPositionWithLocalVector(this.center.add(new Vector3(-((this.getWidth() - this.padding) / 2) * 10 / 12, offSet + this.getHeight() / 2 + (this.getWidth() - this.padding) / 2, 0)));
            this.d3ModelChimney2.setPositionWithLocalVector(this.center.add(new Vector3(0, offSet + this.getHeight() / 2 + (this.getWidth() - this.padding) / 2, 0)));
            this.d3ModelChimney3.setPositionWithLocalVector(this.center.add(new Vector3(((this.getWidth() - this.padding) / 2) * 10 / 12, offSet + this.getHeight() / 2 + (this.getWidth() - this.padding) / 2, 0)));
            this.d3ModelChimney1.material = mat;
            this.d3ModelChimney2.material = mat;
            this.d3ModelChimney3.material = mat;
            this.d3ModelChimney1.material.backFaceCulling = false;
            this.d3ModelChimney2.material.backFaceCulling = false;
            this.d3ModelChimney3.material.backFaceCulling = false;
            offSet += this.getWidth() - this.padding;
            this.d3Model = Mesh.MergeMeshes([this.d3Model, this.d3ModelChimney1, this.d3ModelChimney2, this.d3ModelChimney3], true);
        }

        // draw top pyramid if API class
        if (this.elementModel.types.includes("API")) {
            this.d3ModelPyramid = MeshBuilder.CreateCylinder("pyramid", {
                diameterTop: 0,
                tessellation: 4,
                diameterBottom: this.getWidth() - this.padding,
                height: this.getWidth() - this.padding
            }, this.scene);
            this.d3ModelPyramid.setPositionWithLocalVector(this.center.add(new Vector3(0, offSet + this.getHeight() / 2 + (this.getWidth() - this.padding) / 2 + this.edgesWidth / 120, 0)));
            this.d3ModelPyramid.rotate(new Vector3(0, 1, 0), Math.PI / 4);
            this.d3ModelPyramid.material = mat;
            this.d3ModelPyramid.material.backFaceCulling = false;
            this.d3Model = Mesh.MergeMeshes([this.d3Model, this.d3ModelPyramid], true);
        }

        // Default edge coloring
        this.d3Model.enableEdgesRendering();
        this.d3Model.edgesWidth = this.edgesWidth;

        let hsv = this.rgb2Hsv(mat.emissiveColor.r, mat.emissiveColor.g, mat.emissiveColor.b)
        let rgb = this.hsv2Rgb(hsv[0], hsv[1], Math.max(hsv[2] - 0.2, 0))
        this.d3Model.edgesColor = new Color4(rgb[0], rgb[1], rgb[2], 1)

        if (this.config.building.colors.edges) {
            const edgesColor = this.getColor(this.config.building.colors.edges, this.elementModel.types);
            if (edgesColor !== undefined) {
                this.d3Model.enableEdgesRendering();
                this.d3Model.edgesWidth = this.edgesWidth;
                const c = Color3.FromHexString(edgesColor);
                this.d3Model.edgesColor = new Color4(c.r, c.g, c.b, 1);
                // if (this.d3ModelPyramid !== undefined) {
                //     this.d3ModelPyramid.enableEdgesRendering();
                //     this.d3ModelPyramid.edgesWidth = this.edgesWidth;
                //     const c = Color3.FromHexString(edgesColor);
                //     this.d3ModelPyramid.edgesColor = new Color4(c.r, c.g, c.b, 1);
                // }
                // if (this.d3ModelChimney1 !== undefined) {
                //     this.d3ModelChimney1.enableEdgesRendering();
                //     this.d3ModelChimney1.edgesWidth = this.edgesWidth;
                //     const c = Color3.FromHexString(edgesColor);
                //     this.d3ModelChimney1.edgesColor = new Color4(c.r, c.g, c.b, 1);
                // }
                // if (this.d3ModelChimney2 !== undefined) {
                //     this.d3ModelChimney2.enableEdgesRendering();
                //     this.d3ModelChimney2.edgesWidth = this.edgesWidth;
                //     const c = Color3.FromHexString(edgesColor);
                //     this.d3ModelChimney2.edgesColor = new Color4(c.r, c.g, c.b, 1);
                // }
                // if (this.d3ModelChimney3 !== undefined) {
                //     this.d3ModelChimney3.enableEdgesRendering();
                //     this.d3ModelChimney3.edgesWidth = this.edgesWidth;
                //     const c = Color3.FromHexString(edgesColor);
                //     this.d3ModelChimney3.edgesColor = new Color4(c.r, c.g, c.b, 1);
                // }
                // if (this.d3ModelSphere !== undefined) {
                //     this.d3ModelSphere.enableEdgesRendering();
                //     this.d3ModelSphere.edgesWidth = this.edgesWidth;
                //     const c = Color3.FromHexString(edgesColor);
                //     this.d3ModelSphere.edgesColor = new Color4(c.r, c.g, c.b, 1);
                // }
                // if (this.d3ModelInvertedPyramid !== undefined) {
                //     this.d3ModelInvertedPyramid.enableEdgesRendering();
                //     this.d3ModelInvertedPyramid.edgesWidth = this.edgesWidth;
                //     const c = Color3.FromHexString(edgesColor);
                //     this.d3ModelInvertedPyramid.edgesColor = new Color4(c.r, c.g, c.b, 1);
                // }
                // if (this.d3ModelPrism !== undefined) {
                //     this.d3ModelPrism.enableEdgesRendering();
                //     this.d3ModelPrism.edgesWidth = this.edgesWidth;
                //     const c = Color3.FromHexString(edgesColor);
                //     this.d3ModelPrism.edgesColor = new Color4(c.r, c.g, c.b, 1);
                // }
            }

            this.d3Model.actionManager = new ActionManager(this.scene);

            UIController.addEntry(this.getName(), this);

            // const links = this.links;
            this.d3Model.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnPointerOverTrigger
                    },
                    () => {
                        this.highlight(true);
                        this.links.forEach(l => l.display(undefined, true));
                        UIController.displayObjectInfo(this);
                        // document.getElementById("nodes_details").innerText = out;
                    }
                )
            );
            this.d3Model.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnPointerOutTrigger
                    },
                    () => {
                        this.highlight(false);
                        this.links.forEach(l => l.display(undefined, false));
                    }
                )
            );
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

        // Display links to other buildings
        // this.links.forEach(l => {
        //     if (l.src.elementModel.name === this.getName()) l.render(this.config);
        // });
    }

    /**
     * Converts an RGB color value to HSV. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes r, g, and b are contained in the set [0, 1] and
     * returns h, s, and v in the set [0, 1].
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSV representation
     */
    public rgb2Hsv(r, g, b) {

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return [h, s, v];
    }

    /**
     * Converts an HSV color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes h, s, and v are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  v       The value
     * @return  Array           The RGB representation
     */
    public hsv2Rgb(h, s, v) {
        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }

        return [r, g, b];
    }

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 1].
     *
     * @param   {number}  h       The hue
     * @param   {number}  s       The saturation
     * @param   {number}  l       The lightness
     * @return  {Array}           The RGB representation
     */
    public hsl2Rgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r, g, b];
    }

    public normalize(val, max_v, min_v, min, max): number {
        let n = ((val - min_v) / (max_v - min_v))
        n = Math.max(min, n)
        n = Math.min(max, n)

        let c = (n * (max - min)) + min
        c = Math.max(min, c)
        c = Math.min(max, c)
        return c;
    }
}
