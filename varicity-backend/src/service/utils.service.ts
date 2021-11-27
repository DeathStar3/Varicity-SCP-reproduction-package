import {JsonDB} from "node-json-db";
import {Config} from "node-json-db/dist/lib/JsonDBConfig";
import {JsonInputInterface, MetricClassInterface} from "../model/jsonInput.interface";
import {Project} from "../model/user.model";

var fs = require('fs');
var path = require('path');

export class UtilsService {


    public static getFileNameOnly(filePath: string): string {
        return filePath.split('/').pop().split('.json').shift();
    }

    public static traverseDir(dir): string[] {
        let paths = [];

        fs.readdirSync(dir).forEach(file => {
            let fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                paths.push(...UtilsService.traverseDir(fullPath));
            } else {
                paths.push(fullPath);
            }
        });

        return paths;
    }
}
