import {JsonDB} from "node-json-db";
import {Config} from "node-json-db/dist/lib/JsonDBConfig";
import {JsonInputInterface, MetricClassInterface} from "../model/jsonInput.interface";
import * as fs from 'fs';

const path = require('path');

export class FileLoaderService {


    private static getFileNameOnly(filePath: string): string {
        return filePath.split('/').pop().split('.json').shift();
    }

    private static loadJson(projectName: string): JsonInputInterface {
        // Get all jsons path found in /symfinder_files

        let db = new JsonDB(new Config(`data/symfinder_files/${projectName}.json`, true, true, '/'));


        let symfinderObj = db.getData('/') as JsonInputInterface;


        let mapSymFinderClassesIndex = this.indexSymFinderClassesToMap(symfinderObj);


        ['sonarcloud', 'sonarqube'].forEach(metricsource => {
            const metricsPath = path.join(process.cwd(), `data/symfinder_files/externals/${projectName}/${projectName}-${metricsource}.json`)

            if (fs.existsSync(metricsPath)) {

                let externalMetrics = new JsonDB(new Config(`data/symfinder_files/externals/${projectName}/${projectName}-${metricsource}.json`, true, true, '/')).getData('/') as MetricClassInterface[]

                console.log()
                externalMetrics.forEach((classMetrics) => {

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
            }

        })
        return symfinderObj;
    }


    private static indexSymFinderClassesToMap(symfinderObj: JsonInputInterface) {
        let mapSymFinderClassesIndex = new Map<string, number>();
        for (let i = 0; i < symfinderObj.nodes.length; i++) {
            mapSymFinderClassesIndex.set(symfinderObj.nodes[i].name, i);
        }
        return mapSymFinderClassesIndex;
    }

    public static loadVisualizationInfoOfProject(project: string): JsonInputInterface {
        return FileLoaderService.loadJson(project);
    }
}
