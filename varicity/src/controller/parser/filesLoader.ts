import {JsonInputInterface, MetricClassInterface} from './../../model/entities/jsonInput.interface';

export class FilesLoader {
    private static json: Map<string, JsonInputInterface> = undefined;

    private static getFileNameOnly(filePath: string): string {
        return filePath.split('/').pop().split('.json').shift();
    }

    // TODO reduce the complexity, and add methods for readability.
    private static loadJson(): void {
        const rootAnalysedProjectContext = require.context('/symfinder_files', true, /^(?!.*-stats\.json)(.*\.json)$/);

        FilesLoader.json = new Map<string, JsonInputInterface>();
        let symFinderFilesPathsMap = new Map<string, string[]>();
        let externalMetricsFilesPathsMap = new Map<string, string[]>();

        // Get the path of symfinder's & external metrics jsons
        rootAnalysedProjectContext.keys().forEach((key) => {
            var myRegexp = new RegExp("^\\.\\/([a-zA-Z\\-\\_.0-9]+)\\/", "g");
            let match = myRegexp.exec(key);
            if (match !== undefined && match != null) {
                // [0]: contains "./directory/"
                // [1]: contains "directory"
                const directoryName = match[1];

                if (FilesLoader.isPathToSymfinderJson(key)) {
                    if(symFinderFilesPathsMap.has(directoryName)){
                        symFinderFilesPathsMap.get(directoryName).push(key);
                    }else{
                        symFinderFilesPathsMap.set(directoryName, [key]);
                    }
                }
                if (FilesLoader.isPathToExternalMetricsJson(key)) {
                    if(externalMetricsFilesPathsMap.has(directoryName)){
                        externalMetricsFilesPathsMap.get(directoryName).push(key);
                    }else{
                        externalMetricsFilesPathsMap.set(directoryName, [key]);
                    }
                }
            }
        });

        console.log("symFinderFilesPathsMap");
        console.log(symFinderFilesPathsMap);
        console.log("externalMetricsFilesPathsMap");
        console.log(externalMetricsFilesPathsMap);

        // deserialize the symfinder's & external metrics' jsons

        // loop over all the symfinder's Jsons
        symFinderFilesPathsMap.forEach((symfinderJsonPaths, directoryName) => {

            // loop over the symfinder's Json inside a single project if has multiple ones.
            symfinderJsonPaths.forEach((symfinderJsonPath) => {

                // fetch symfinder input json
                const obj = rootAnalysedProjectContext(symfinderJsonPath);
                let jsonInputInterface = obj as JsonInputInterface;

                // aggregate externals metrics if any
                const externalsMetricsPaths = externalMetricsFilesPathsMap.get(directoryName);
                if(externalsMetricsPaths !== undefined){

                    // index all classes indexes to reduce the complexity of merging external jsons.
                    let mapSymFinderClassesIndex = new Map<string, number>();
                    for (let i = 0; i < jsonInputInterface.nodes.length; i++) {
                        mapSymFinderClassesIndex.set(jsonInputInterface.nodes[i].name, i);
                    }

                    // loop over all the external metrics Json for the project
                    externalsMetricsPaths.forEach((externalsMetricsPath) => {

                        // get the object of external metrics
                        const obj = rootAnalysedProjectContext(externalsMetricsPath);
                        let jsonMetricClassArrayInputInterface = obj as MetricClassInterface[];

                        // loop over all the classes in the external jsons object
                        jsonMetricClassArrayInputInterface.forEach((classMetrics) => {

                            if(mapSymFinderClassesIndex.has(classMetrics.name)){
                                const index = mapSymFinderClassesIndex.get(classMetrics.name);
                                if(jsonInputInterface.nodes[index].additionalMetrics === undefined){
                                    jsonInputInterface.nodes[index].additionalMetrics = [];
                                }

                                // aggregate the metrics in the symfinder object classes.
                                classMetrics.metrics.forEach((metric) => {
                                    jsonInputInterface.nodes[index].additionalMetrics.push(metric);
                                });
                            }
                        });
                    });
                }

                const projectName = FilesLoader.getFileNameOnly(symfinderJsonPath);
                FilesLoader.json.set(projectName, obj);
            });
        });

        console.log('Loaded json files : ', FilesLoader.json);
    }

    public static loadDataFile(fileName: string): JsonInputInterface {
        if (FilesLoader.json === undefined) {
            FilesLoader.loadJson();
        }
        // return FilesLoader.json[fileName];
        return FilesLoader.json.get(fileName);
    }

    // returns map keys as string array
    public static getAllFilenames(): string[] {
        if (FilesLoader.json === undefined) {
            FilesLoader.loadJson();
        }
        return [...FilesLoader.json.keys()];
    }

    private static isPathToSymfinderJson(key: string): boolean {
        var myRegexp = new RegExp("^\\.\\/([a-zA-Z\\-\\_.0-9]+)\\/([a-zA-Z\\-\\_.0-9]+\\.json)$", "g");
        let match = myRegexp.exec(key);
        return match !== undefined && match != null;
    }

    private static isPathToExternalMetricsJson(key: string): boolean {
        var myRegexp = new RegExp("^\\.\\/([a-zA-Z\\-\\_.0-9]+)\\/externals\\/([a-zA-Z\\-\\_.0-9]+\\.json)$", "g");
        let match = myRegexp.exec(key);
        return match !== undefined && match != null;
    }
}
