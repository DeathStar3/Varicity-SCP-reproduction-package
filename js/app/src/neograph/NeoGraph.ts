import { driver, Driver } from "neo4j-driver";
import { auth, Node, QueryResult, Record, Session, Transaction } from "neo4j-driver-core";
import { exit } from "process";
import { Configuration } from "../configuration/Configuration"
import { NodeType, RelationType, EntityType, EntityAttribut } from "./NodeType";

export default class NeoGraph{

    driver: Driver;

    constructor(config: Configuration){
        this.driver = driver(config.getNeo4JBoltAdress(), auth.basic('neo4j', 'root'));
    }

    async createNode(name: string, type: NodeType, types: NodeType[]): Promise<Node> {
        types.push(type);
        const request = "CREATE (n:"+types.join(':')+" { name: $name}) RETURN (n)";
        return this.submitRequest(request, {name: name}).then((result: Record[]) =>{
            return <Node>(result[0].get(0));
        });
    }

    async getOrCreateNode(name: string, type: EntityType, createAttributes: EntityAttribut[], matchAttributes: EntityAttribut[]): Promise<Node>{
        const onCreateAttributes = createAttributes.length == 0 ? "" : "ON CREATE SET n:" + createAttributes.join(':');
        const onMatchAttributes = matchAttributes.length == 0 ? "" : "ON MATCH SET n:" + matchAttributes.join(":");
        const request = "MERGE (n:"+type+" {name: $name}) "+onCreateAttributes+" "+onMatchAttributes+" RETURN (n)";

        return this.submitRequest(request, {name:name}).then((result: Record[]) =>{
            return <Node>(result[0].get(0));
        });
    }

    async getNode(name: string): Promise<Node | undefined>{
        const request = "MATCH (n {name: $name}) RETURN (n)";

        return this.submitRequest(request, {name:name}).then((result: Record[]) =>{
            return result[0] ? <Node>(result[0].get(0)) : undefined;
        });
    }

    async getNodeWithType(name: string, type: EntityType): Promise<Node | undefined>{
        const request = "MATCH (n:"+type+" {name: $name}) RETURN (n)";

        return this.submitRequest(request, {name:name}).then((result: Record[]) =>{
            return result[0] ? <Node>(result[0].get(0)) : undefined;
        });
    }

    async linkTwoNodes(node1: Node, node2: Node, type: RelationType) {
        const request = "MATCH(a)\n" +
        "WHERE ID(a)=$aId\n" +
        "WITH a\n" +
        "MATCH (b)\n" +
        "WITH a,b\n" +
        "WHERE ID(b)=$bId\n" +
        "CREATE (a)-[r:"+type+"]->(b)";
        this.submitRequest(request, {aId: node1.identity, bId: node2.identity}).then((result: Record[]) =>{
            return;
        });
    }

    async getNbVariant(node: Node): Promise<number>{
        const request = "MATCH (c)-[:EXTENDS|IMPLEMENTS]->(c2:CLASS) " +
        "WHERE ID(c) = $id " +
        "RETURN count(c2)";

        return this.submitRequest(request, {id:node.identity}).then((result: Record[]) =>{
            return <number>(result[0].get(0));
        })
    }

    async addLabelToNode(node: Node, label: string): Promise<void>{
        const request = "MATCH (n) WHERE ID(n) = $id SET n:"+label+" RETURN (n)"
        return this.submitRequest(request, {id:node.identity}).then((result: Record[]) =>{
            return;
        })
    }

    async clearNodes(){
        const request = "MATCH (n) DETACH DELETE n"
        this.submitRequest(request, {});
    }

    async submitRequest(request: string, parameter: any): Promise<Record[]>{
        var maxTry = 10;
        var waitingTime = 5;
        for(let nbTry = 0; nbTry < maxTry; nbTry++){
            try {
                var session: Session = this.driver.session();
                var transaction: Transaction = session.beginTransaction();
                var result: QueryResult = await transaction.run(request, parameter);
                await transaction.commit();
                if(nbTry > 0) process.stdout.write("Database ready.                                               \n");
                return result.records;
            } catch (error) {
                process.stdout.write("Data base not ready... Retrying in "+waitingTime+" sec (" + nbTry + "/" + maxTry + ")" + "\r");
                await new Promise<void>((res) => setTimeout(()=>res(), waitingTime * 1000));
            }
        }
        process.stdout.write("Data base not ready... Retrying in "+waitingTime+" sec (" + maxTry + "/" + maxTry + ")" + "\n");
        console.log("Cannot connect to the database...");
        exit(1);
    }
}