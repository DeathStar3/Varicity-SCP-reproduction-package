import { Injectable } from "@nestjs/common";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
const path = require('path');

@Injectable()
export class PersistenceService {
    private db :JsonDB; 

    constructor(){
        this.db= new JsonDB(new Config(path.join(process.env.PERSISTENT_DIR,'index-db'), true, true, '/'));
        
    }

    getDB(): JsonDB{
        return this.db;
    }
}