import {JsonDB} from "node-json-db";
import {Config} from "node-json-db/dist/lib/JsonDBConfig";
import {JsonInputInterface, MetricClassInterface} from "../model/jsonInput.interface";
import {Project} from "../model/user.model";
import {UtilsService} from "./utils.service";

var fs = require('fs');
var path = require('path');

export class ProjectService {

    private project: Map<string, JsonInputInterface> = undefined;
    private static pathToJsons = "./data/symfinder_files/";

    constructor() {
        this.loadProjects();
        console.log(this.getAllFilenamesFromDisk());
    }

    public loadProjects(): void {  // Get all jsons path found in /symfinder_files
        this.project = new Map<string, JsonInputInterface>();
        let symFinderFilesPathsMap = new Map<string, string>();
        let externalMetricsFilesPathsMap = new Map<string, string[]>();



        // Get the path of SymFinder's & external metrics jsons
        this.findJsons(symFinderFilesPathsMap, externalMetricsFilesPathsMap);

        console.log("symFinderFilesPathsMap: ", symFinderFilesPathsMap);
        console.log("externalMetricsFilesPathsMap: ", externalMetricsFilesPathsMap);

        // deserialize the symfinder's & external metrics' jsons
        this.deserializeJsons(symFinderFilesPathsMap, externalMetricsFilesPathsMap);

        console.log('Loaded json files: ', this.project);
    }

    public findJsons(symFinderFilesPathsMap: Map<string, string>, externalMetricsFilesPathsMap: Map<string, string[]>) {
        const allJsonPaths = this.getAllFilenamesFromDisk();

        allJsonPaths.forEach((key) => {
            let symFinderProjectName = ProjectService.geSymFinderJsonProjectName(key);

            if (symFinderProjectName !== undefined) {
                symFinderFilesPathsMap.set(symFinderProjectName, key);
            } else {
                let externalProjectName = ProjectService.getExternalJsonProjectName(key);
                if (externalProjectName !== undefined) {
                    if (externalMetricsFilesPathsMap.has(externalProjectName)) {
                        externalMetricsFilesPathsMap.get(externalProjectName).push(key);
                    } else {
                        externalMetricsFilesPathsMap.set(externalProjectName, [key]);
                    }
                }
            }
        });
    }

    public deserializeJsons(symFinderFilesPathsMap: Map<string, string>, externalMetricsFilesPathsMap: Map<string, string[]>) {

        // loop over all the SymFinder's Jsons
        symFinderFilesPathsMap.forEach((symfinderJsonPaths, fileNameWithExtension) => {

            // fetch SymFinder input json
            const projectName = ProjectService.getFileNameOnly(fileNameWithExtension);
            let symfinderObj = ProjectService.getJsonFromDisk(symfinderJsonPaths) as JsonInputInterface;

            // aggregate externals metrics if any
            const externalsMetricsPaths = externalMetricsFilesPathsMap.get(projectName);
            if (externalsMetricsPaths !== undefined) {

                // index all classes indexes to reduce the complexity of merging external jsons.
                let mapSymFinderClassesIndex = ProjectService.indexSymFinderClassesToMap(symfinderObj);

                // loop over all the external metrics Json for the project
                externalsMetricsPaths.forEach((externalsMetricsPath) => {

                    // get the object of external metrics
                    let externalMetricsClasses = ProjectService.getJsonFromDisk(externalsMetricsPath) as MetricClassInterface[];

                    // loop over all the classes in the external jsons object
                    externalMetricsClasses.forEach((classMetrics) => {

                        if (mapSymFinderClassesIndex.has(classMetrics.name)) {
                            const index = mapSymFinderClassesIndex.get(classMetrics.name);
                            if (symfinderObj.nodes[index].additionalMetrics === undefined) {
                                symfinderObj.nodes[index].additionalMetrics = [];
                            }

                            // aggregate the metrics in the SymFinder object classes.
                            classMetrics.metrics.forEach((metric) => {
                                symfinderObj.nodes[index].additionalMetrics.push(metric);
                            });
                        }
                    });
                });
            }

            this.project.set(projectName, symfinderObj);
        });
    }

    private static geSymFinderJsonProjectName(key: string): string {
        const myRegexp = new RegExp("^([a-zA-Z\\-\\_.0-9]+\\.json)$", "g");
        let match = myRegexp.exec(key);
        if (match !== undefined && match != null) {
            return match[1];
        } else {
            return undefined;
        }
    }

    private static getExternalJsonProjectName(key: string) {
        const myRegexp = new RegExp("^externals\\/([a-zA-Z\\-\\_.0-9]+)\\/[a-zA-Z\\-\\_.0-9]+\\.json$", "g");
        let match = myRegexp.exec(key);
        if (match !== undefined && match != null) {
            return match[1];
        } else {
            return undefined;
        }
    }

    private static getJsonFromDisk(path: string): any{
        return JSON.parse(fs.readFileSync(ProjectService.pathToJsons + path, 'utf8'));
    }

    private static getFileNameOnly(filePath: string): string {
        return filePath.split('/').pop().split('.json').shift();
    }

    public loadVisualizationInfoOfProject(project: string): JsonInputInterface {
        return this.project.get(project);
    }

    private static indexSymFinderClassesToMap(symfinderObj: JsonInputInterface) {
        let mapSymFinderClassesIndex = new Map<string, number>();
        for (let i = 0; i < symfinderObj.nodes.length; i++) {
            mapSymFinderClassesIndex.set(symfinderObj.nodes[i].name, i);
        }
        return mapSymFinderClassesIndex;
    }

    public loadDataFile(fileName: string): JsonInputInterface {
        if (this.project === undefined) {
            this.loadProjects();
        }
        return this.project.get(fileName);
    }

    public getAllFilenames(): string[] {
        if (this.project === undefined) {
            this.loadProjects();
        }
        return [...this.project.keys()];
    }

    public getAllFilenamesFromDisk(): string[] {
        let pathsWithStartDir = UtilsService.traverseDir(ProjectService.pathToJsons);
        let paths = [];

        pathsWithStartDir.forEach(path => {
            let newPath =  path.replace(/\\+/g, "/");
            let newPathSplit = newPath.split('\/');
            newPathSplit.shift();
            newPathSplit.shift();
            paths.push(newPathSplit.join('/'))
        })

        return paths;
    }

    getAllProjectsName(): string[] {
        return [...this.project.keys()]; // todo change
    }

    addProject(project: Project) {
        // TODO
        // let index = 0;
        //
        // if (this.db.exists('/projects')) {
        //     index = this.db.count("/projects");
        //     const existingProject = this.db.find<Project>('/users', (entry: { projectName: string; }, _: any) => entry.projectName == project.projectName);
        //
        //     if (existingProject) {
        //         return existingProject;
        //     }
        //
        // }
        // project.index = index;
        // this.db.push(`/projects[]`, project);

        return project;
    }
}
