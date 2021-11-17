import * as neo4j from "neo4j-driver";
import { Configuration } from "../configuration/Configuration"
import { NodeType } from "./NodeType";

export default class NeoGraph{

    driver: neo4j.Driver;

    constructor(config: Configuration){
        this.driver = neo4j.driver(config.getNeo4JBoltAdress(), neo4j.auth.basic('neo4j', 'root'));
    }

    async createNode(name: string, type: NodeType, types: NodeType[]) {
        types.push(type)
        const request = "CREATE (n:"+types.join(':')+" { name: $name}) RETURN (n)";
        return this.submitRequest(request, {name: name}).catch((error) => console.log(error));
    }

    async submitRequest(request: string, parameter: any): Promise<neo4j.Record[]>{

        try {
            var session: neo4j.Session = this.driver.session();
            var transaction: neo4j.Transaction = session.beginTransaction();
            var result: neo4j.QueryResult = await transaction.run(request, parameter);
            await transaction.commit();
            return result.records;
        } catch (error) {
            console.log("Neo4j database not ready...");
            throw error;
        }
    }
}