import {JsonInputInterface, MetricClassInterface} from './../../model/entities/jsonInput.interface';

export class FilesLoader {
    private static json: Map<string, JsonInputInterface> = undefined;

    private static getFileNameOnly(filePath: string): string {
        return filePath.split('/').pop().split('.json').shift();
    }

    private static loadJson(): void {
        // Get all jsons path found in /symfinder_files
        const rootAnalysedProjectContext = require.context('/symfinder_files', true, /^(?!.*-stats\.json)(.*\.json)$/);

        FilesLoader.json = new Map<string, JsonInputInterface>();
        let symFinderFilesPathsMap = new Map<string, string>();
        let externalMetricsFilesPathsMap = new Map<string, string[]>();

        // Get the path of SymFinder's & external metrics jsons
        this.findJsons(rootAnalysedProjectContext, symFinderFilesPathsMap, externalMetricsFilesPathsMap);

        console.log("symFinderFilesPathsMap: ", symFinderFilesPathsMap);
        console.log("externalMetricsFilesPathsMap: ", externalMetricsFilesPathsMap);

        // deserialize the symfinder's & external metrics' jsons
        this.deserializeJsons(symFinderFilesPathsMap, rootAnalysedProjectContext, externalMetricsFilesPathsMap);

        console.log('Loaded json files: ', FilesLoader.json);
    }

    private static findJsons(rootAnalysedProjectContext: __WebpackModuleApi.RequireContext, symFinderFilesPathsMap: Map<string, string>, externalMetricsFilesPathsMap: Map<string, string[]>) {
        rootAnalysedProjectContext.keys().forEach((key) => {
            let symFinderProjectName = this.geSymFinderJsonProjectName(key);

            if (symFinderProjectName !== undefined) {
                symFinderFilesPathsMap.set(symFinderProjectName, key);
            } else {
                let externalProjectName = this.getExternalJsonProjectName(key);
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

    private static deserializeJsons(symFinderFilesPathsMap: Map<string, string>, rootAnalysedProjectContext: __WebpackModuleApi.RequireContext, externalMetricsFilesPathsMap: Map<string, string[]>) {

        // loop over all the SymFinder's Jsons
        symFinderFilesPathsMap.forEach((symfinderJsonPaths, fileNameWithExtension) => {

            // fetch SymFinder input json
            const projectName = FilesLoader.getFileNameOnly(fileNameWithExtension);
            let symfinderObj = rootAnalysedProjectContext(symfinderJsonPaths) as JsonInputInterface;

            // aggregate externals metrics if any
            const externalsMetricsPaths = externalMetricsFilesPathsMap.get(projectName);
            if (externalsMetricsPaths !== undefined) {

                // index all classes indexes to reduce the complexity of merging external jsons.
                let mapSymFinderClassesIndex = this.indexSymFinderClassesToMap(symfinderObj);

                // loop over all the external metrics Json for the project
                externalsMetricsPaths.forEach((externalsMetricsPath) => {

                    // get the object of external metrics
                    let externalMetricsClasses = rootAnalysedProjectContext(externalsMetricsPath) as MetricClassInterface[];

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

            FilesLoader.json.set(projectName, symfinderObj);
        });
    }

    private static geSymFinderJsonProjectName(key: string): string {
        const myRegexp = new RegExp("^\\.\\/([a-zA-Z\\-\\_.0-9]+\\.json)$", "g");
        let match = myRegexp.exec(key);
        if (match !== undefined && match != null) {
            return match[1];
        } else {
            return undefined;
        }
    }

    private static getExternalJsonProjectName(key: string) {
        const myRegexp = new RegExp("^\\.\\/externals\\/([a-zA-Z\\-\\_.0-9]+)\\/[a-zA-Z\\-\\_.0-9]+\\.json$", "g");
        let match = myRegexp.exec(key);
        if (match !== undefined && match != null) {
            return match[1];
        } else {
            return undefined;
        }
    }

    private static indexSymFinderClassesToMap(symfinderObj: JsonInputInterface) {
        let mapSymFinderClassesIndex = new Map<string, number>();
        for (let i = 0; i < symfinderObj.nodes.length; i++) {
            mapSymFinderClassesIndex.set(symfinderObj.nodes[i].name, i);
        }
        return mapSymFinderClassesIndex;
    }

    public static loadDataFile(fileName: string): JsonInputInterface {
        if (FilesLoader.json === undefined) {
            FilesLoader.loadJson();
        }
        return FilesLoader.json.get(fileName);
    }

    public static getAllFilenames(): string[] {
        if (FilesLoader.json === undefined) {
            FilesLoader.loadJson();
        }
        return [...FilesLoader.json.keys()];
    }
}
