import * as neo4j from "neo4j-driver";
import { Configuration } from "../configuration/Configuration"
import { NodeType, RelationType, EntityType, EntityAttribut } from "./NodeType";

export default class NeoGraph{

    driver: neo4j.Driver;

    constructor(config: Configuration){
        this.driver = neo4j.driver(config.getNeo4JBoltAdress(), neo4j.auth.basic('neo4j', 'root'));
    }

    createNode(name: string, type: NodeType, types: NodeType[]): Promise<neo4j.Node> {
        types.push(type);
        const request = "CREATE (n:"+types.join(':')+" { name: $name}) RETURN (n)";
        return this.submitRequest(request, {name: name}).then((result: neo4j.Record[]) =>{
            return <neo4j.Node>(result[0].get(0));
        });
    }

    getOrCreateNode(name: string, type: EntityType, createAttributes: EntityAttribut[], matchAttributes: EntityAttribut[]): Promise<neo4j.Node>{
        const onCreateAttributes = createAttributes.length == 0 ? "" : "ON CREATE SET n:" + createAttributes.join(':');
        const onMatchAttributes = matchAttributes.length == 0 ? "" : "ON MATCH SET n:" + matchAttributes.join(":");
        const request = "MERGE (n:"+type+" {name: $name}) "+onCreateAttributes+" "+onMatchAttributes+" RETURN (n)";

        return this.submitRequest(request, {name:name}).then((result: neo4j.Record[]) =>{
            return <neo4j.Node>(result[0].get(0));
        });
    }

    getNode(name: string, type: EntityType): Promise<neo4j.Node>{
        const request = "MATCH (n:"+type+" {name: $name}) RETURN (n)";

        return this.submitRequest(request, {name:name}).then((result: neo4j.Record[]) =>{
            return <neo4j.Node>(result[0].get(0));
        });
    }

    linkTwoNodes(node1: neo4j.Node, node2: neo4j.Node, type: RelationType): void {
        const request = "MATCH(a)\n" +
        "WHERE ID(a)=$aId\n" +
        "WITH a\n" +
        "MATCH (b)\n" +
        "WITH a,b\n" +
        "WHERE ID(b)=$bId\n" +
        "CREATE (a)-[r:"+type+"]->(b)";
        this.submitRequest(request, {aId: node1.identity, bId: node2.identity});
    }

    clearNodes(){
        const request = "MATCH (n) DETACH DELETE n"
        this.submitRequest(request, {});
    }

    submitRequest(request: string, parameter: any): Promise<neo4j.Record[]>{
        try {
            var session: neo4j.Session = this.driver.session();
            var transaction: neo4j.Transaction = session.beginTransaction();
            return transaction.run(request, parameter).then((result: neo4j.QueryResult) => {
                return transaction.commit().then(() => result.records);
            });
        } catch (error) {
            console.log("Neo4j database not ready...");
            throw error;
        }
    }
}