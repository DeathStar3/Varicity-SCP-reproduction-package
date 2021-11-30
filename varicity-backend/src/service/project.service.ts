import {DisksProjectPaths, JsonInputInterface, MetricClassInterface} from "../model/jsonInput.interface";
import {AppModule} from "../app.module";

var fs = require('fs');

export class ProjectService {

    private static pathToJsons = "./data/symfinder_files/";

    /******************
     * LOAD A PROJECT *
     ******************/

    /**
     * Load a given json file from disk using it path
     */
    private static getJsonFromDisk(path: string): any {
        return JSON.parse(fs.readFileSync(ProjectService.pathToJsons + path, 'utf8'));
    }

    /**
     * Load SymFinder and external metrics jsons for a given project and merge them into a single object
     */
    public loadProject(projectName: string): JsonInputInterface {
        const projectPaths = this.getProjectPaths(projectName);

        // TODO save the merged file instead of re-parsing it every time

        // fetch SymFinder input json
        let symfinderObj = ProjectService.getJsonFromDisk(projectPaths.symFinderFilePath) as JsonInputInterface;

        // aggregate externals metrics if any
        const externalsMetricsPaths = projectPaths.externalFilePaths;

        if (externalsMetricsPaths.length !== 0) {

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

    /**
     * Create a map base on SymFinder json, the map is then used to easily merge the SymFinder data with the external metrics
     */
    private static indexSymFinderClassesToMap(symfinderObj: JsonInputInterface) {
        let mapSymFinderClassesIndex = new Map<string, number>();
        for (let i = 0; i < symfinderObj.nodes.length; i++) {
            mapSymFinderClassesIndex.set(symfinderObj.nodes[i].name, i);
        }
        return mapSymFinderClassesIndex;
    }

    /**
     * Return a list with all the project names
     */
    public getAllProjectsName(): string[] {
        return Object.keys(AppModule.DB.getData("/data"));
    }

    /**
     * Return an object that contain the SymFinder and external jsons locations
     */
    private getProjectPaths(projectName: string): DisksProjectPaths {
        const allFilePaths = AppModule.DB.getData("/data/" + projectName);

        let symFinderFilesPath: string;
        let externalFilesPaths = [];

        allFilePaths.forEach((filePath) => {
            if (filePath.split('\/')[0] === 'externals'){ // If is an external file
                externalFilesPaths.push(filePath);
            }else{ // If is the SymFinder file
                symFinderFilesPath = filePath;
            }
        });
        return new DisksProjectPaths(symFinderFilesPath, externalFilesPaths);
    }

    public getProjectMetrics(projectName): string[] {
        const project = this.loadProject(projectName);
        let metrics = new Set<string>();

        // TODO save in DB after first time
        project.nodes.forEach(node => {
            if(node.additionalMetrics !== undefined){
                node.additionalMetrics.forEach(metric => {
                    metrics.add(metric.name);
                })
            }
        })

        return [...metrics.keys()];
    }
}
