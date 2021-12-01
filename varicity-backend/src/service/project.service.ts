import { DisksProjectPaths, JsonInputInterface, MetricClassInterface } from "../model/jsonInput.interface";
import { AppModule } from "../app.module";
import { ExperimentResult } from "src/model/experiment.model";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

var fs = require('fs');

export class ProjectService {

    db = new JsonDB(new Config("varicitydb", true, true, '/'));

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
            if (filePath.split('\/')[0] === 'externals') { // If is an external file
                externalFilesPaths.push(filePath);
            } else { // If is the SymFinder file
                symFinderFilesPath = filePath;
            }
        });
        return new DisksProjectPaths(symFinderFilesPath, externalFilesPaths);
    }

    /**
     * Return all the External and Variability metrics from the specified project
     * @param projectName
     */
    public getProjectMetrics(projectName): string[] {
        return [...this.getProjectMetricsExternal(projectName), ...this.getProjectMetricsVariability(projectName)]
    }

    /**
     * Get only the variability metrics that are calculated in Varicity
     * @param projectName
     */
    getProjectMetricsVariability(projectName): string[] {
        return [VariabilityMetricsName.NB_METHOD_VARIANTS, VariabilityMetricsName.NB_ATTRIBUTES, VariabilityMetricsName.NB_CONSTRUCTOR_VARIANTS, VariabilityMetricsName.NB_VARIANTS];
    }

    /**
     * Get the external metric names from the project specified
     * @param projectName
     */
    getProjectMetricsExternal(projectName): string[] {
        const project = this.loadProject(projectName);
        let metrics = new Set<string>();

        // TODO save in DB after first time
        project.nodes.forEach(node => {
            if (node.additionalMetrics !== undefined) {
                node.additionalMetrics.forEach(metric => {
                    metrics.add(metric.name);
                })
            }
        })

        return [...metrics.keys()];
    }

    addProject(project: ExperimentResult) {
        let index = 0;
        if (this.db.exists('/projects')) {
            index = this.db.getIndex('/projects', project.projectName, 'projectName')

            if (index > -1) {
                this.db.push(`/projects[${index}]`, { 'projectName': project.projectName });//ne changerait rien vu qu'il n'y a qu'une seule propriété
                //mais peut être utile si on ajoute des propriétés
                
            }
            else{
                this.db.push(`/projects[]`, { 'projectName': project.projectName });
            }
        }else{
            this.db.push(`/projects[]`, { 'projectName': project.projectName });
        }
        
        console.log(project.externalMetric)
        if (project.externalMetric !== undefined && project.externalMetric !== null && project.externalMetric.size > 0) {
            project.externalMetric.forEach((metric, name) => {
                let externalMetricDB = new JsonDB(new Config(ProjectService.pathToJsons + `externals/${project.projectName}/${project.projectName}-${name}`,));

                externalMetricDB.push(`/`, metric);

            })
        }

        if (project.symfinderResult != null && project.symfinderResult != undefined) {
            if (project.symfinderResult.vpJsonGraph !== undefined && project.symfinderResult.vpJsonGraph !== null
                && project.symfinderResult.vpJsonGraph.trim().length > 0) {
                let symfinderResultDB = new JsonDB(new Config(ProjectService.pathToJsons + `${project.projectName}`, true, true, '/'));

                symfinderResultDB.push(`/`, JSON.parse(project.symfinderResult.vpJsonGraph));
            }

        }

       
    }
}
