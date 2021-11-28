import {JsonDB} from "node-json-db";
import {Config} from "node-json-db/dist/lib/JsonDBConfig";
import {DisksProjectPaths, JsonInputInterface, MetricClassInterface} from "../model/jsonInput.interface";
import {Project} from "../model/user.model";
import {UtilsService} from "./utils.service";

var fs = require('fs');

export class ProjectService {

    db = new JsonDB(new Config("projects-db", true, true, '/'));
    private static pathToJsons = "./data/symfinder_files/";

    public findJsons(symFinderFilesPathsMap: Map<string, string>, externalMetricsFilesPathsMap: Map<string, string[]>) {
        const allJsonPaths = this.getAllFilenamesFromDisk();

        allJsonPaths.forEach((key) => {
            let symFinderProjectName = ProjectService.getSymFinderJsonProjectName(key);

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

    private static getSymFinderJsonProjectName(key: string): string {
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

    private static getJsonFromDisk(path: string): any {
        return JSON.parse(fs.readFileSync(ProjectService.pathToJsons + path, 'utf8'));
    }

    private static getFileNameOnly(filePath: string): string {
        return filePath.split('/').pop().split('.json').shift();
    }

    public loadVisualizationInfoOfProject(projectName: string): JsonInputInterface {
        const projectPaths = this.getProjectPaths(projectName);

        // fetch SymFinder input json
        let symfinderObj = ProjectService.getJsonFromDisk(projectPaths.symFinderFilePath) as JsonInputInterface;

        // aggregate externals metrics if any
        const externalsMetricsPaths = projectPaths.externalFilePaths;

        if(externalsMetricsPaths.length === 0){

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

        return symfinderObj;
    }

    private static indexSymFinderClassesToMap(symfinderObj: JsonInputInterface) {
        let mapSymFinderClassesIndex = new Map<string, number>();
        for (let i = 0; i < symfinderObj.nodes.length; i++) {
            mapSymFinderClassesIndex.set(symfinderObj.nodes[i].name, i);
        }
        return mapSymFinderClassesIndex;
    }

    public getAllFilenamesFromDisk(): string[] {
        if (this.db.exists('/projects/names')) {
            return this.db.getData('/projects/names')
        } else {
            let pathsWithStartDir = UtilsService.traverseDir(ProjectService.pathToJsons);
            let paths = [];

            pathsWithStartDir.forEach(path => {
                let newPath = path.replace(/\\+/g, "/");
                let newPathSplit = newPath.split('\/');
                newPathSplit.shift();
                newPathSplit.shift();
                paths.push(newPathSplit.join('/'))
            })
            this.db.push('/projects/names', paths);
            return paths;
        }
    }

    getAllProjectsName(): string[] {
        const allFilesPaths = this.getAllFilenamesFromDisk();
        let projectNames = [];

        allFilesPaths.forEach(path => {
            if (!path.includes('/')) {
                projectNames.push(path.split('.json')[0]);
            }
        })

        return projectNames;
    }

    private getProjectPaths(projectName: string): DisksProjectPaths {
        const allFilePaths = this.getAllFilenamesFromDisk();

        let symFinderFilesPath: string;
        let externalFilesPaths = [];

        allFilePaths.forEach((filePath) => {
            const currentProjectName = ProjectService.getFileNameOnly(filePath);
            let symFinderProjectName = ProjectService.getSymFinderJsonProjectName(filePath);
            if (symFinderProjectName !== undefined && currentProjectName === (projectName)) {
                console.log(symFinderProjectName);
                symFinderFilesPath = filePath;
            } else {
                let externalProjectName = ProjectService.getExternalJsonProjectName(filePath);
                if (externalProjectName !== undefined && externalProjectName === projectName) {
                    externalFilesPaths.push(filePath);
                }
            }
        });

        return new DisksProjectPaths(symFinderFilesPath, externalFilesPaths);
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
