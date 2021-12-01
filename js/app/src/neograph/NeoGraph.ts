import { driver, Driver } from "neo4j-driver";
import { auth, Node, QueryResult, Record, Session, Transaction } from "neo4j-driver-core";
import { exit } from "process";
import { Configuration } from "../configuration/Configuration"
import { NodeType, RelationType, EntityType, EntityAttribut, DesignPatternType } from "./NodeType";

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

    async getNodeWithModule(name: string, moduleName: string): Promise<Node | undefined>{
        const request = "MATCH (n {name: $name})<--(m {name: $moduleName}) RETURN (n)";

        return this.submitRequest(request, {name:name, moduleName:moduleName}).then((result: Record[]) =>{
            return result[0] ? <Node>(result[0].get(0)) : undefined;
        });
    }

    async getNodeWithType(name: string, type: EntityType): Promise<Node | undefined>{
        const request = "MATCH (n:"+type+" {name: $name}) RETURN (n)";

        return this.submitRequest(request, {name:name}).then((result: Record[]) =>{
            return result[0] ? <Node>(result[0].get(0)) : undefined;
        });
    }

    async linkTwoNodes(node1: Node, node2: Node, type: RelationType): Promise<void> {
        const request = "MATCH(a)\n" +
        "WHERE ID(a)=$aId\n" +
        "WITH a\n" +
        "MATCH (b)\n" +
        "WITH a,b\n" +
        "WHERE ID(b)=$bId\n" +
        "CREATE (a)-[r:"+type+"]->(b)";
        await this.submitRequest(request, {aId: node1.identity, bId: node2.identity});
    }

    async updateLinkTwoNode(node1: Node, node2: Node, oldType: RelationType, newType: RelationType): Promise<void> {
        const request = "MATCH(a)\n" +
        "WHERE ID(a)=$aId\n" +
        "WITH a\n" +
        "MATCH (b)\n" +
        "WITH a,b\n" +
        "WHERE ID(b)=$bId\n" +
        "MATCH(a)-[r1:"+oldType+"]->(b)\n" +
        "DELETE r1\n" +
        "CREATE (a)-[r2:"+newType+"]->(b)";

        await this.submitRequest(request, {aId: node1.identity, bId: node2.identity});
    }

    async getNbVariant(node: Node): Promise<number>{
        const request = "MATCH (c)-[:EXTENDS|IMPLEMENTS]->(c2:CLASS) " +
        "WHERE ID(c) = $id " +
        "RETURN count(c2)";

        return this.submitRequest(request, {id:node.identity}).then((result: Record[]) =>{
            return +(result[0].get(0));
        })
    }

    async addLabelToNode(node: Node, label: string): Promise<void>{
        const request = "MATCH (n) WHERE ID(n) = $id SET n:"+label+" RETURN (n)"
        return this.submitRequest(request, {id:node.identity}).then((result: Record[]) =>{
            return;
        })
    }

    async detectVPsAndVariants(): Promise<void>{
        await this.setMethodVPs();
        await this.setMethodVariants();
        await this.setConstructorVPs();
        await this.setConstructorVariants();
        await this.setNbVariantsProperty();
        await this.setVPLabels();
        await this.setMethodLevelVPLabels();
        await this.setVariantsLabels();
        await this.setPublicMethods();
        await this.setPublicConstructors();
        await this.setNbCompositions();
        await this.setAllMethods();
        await this.detectStrategiesWithComposition();
        await this.detectDensity();
        await this.setModuleVP();
        await this.setModuleVariant();
    }

    async setMethodVPs(): Promise<void>{
        await this.submitRequest("MATCH (c:CLASS)-->(a:METHOD) MATCH (c:CLASS)-->(b:METHOD)\n" +
        "WHERE a.name = b.name AND ID(a) <> ID(b)\n" +
        "WITH count(DISTINCT a.name) AS cnt, c\n" +
        "SET c.methodVPs = cnt", {});

        await this.submitRequest("MATCH (c:CLASS)\n" +
        "WHERE NOT EXISTS(c.methodVPs)\n" +
        "SET c.methodVPs = 0",{});
    }

    async setMethodVariants(): Promise<void>{
        await this.submitRequest("MATCH (c:CLASS)-->(a:METHOD) MATCH (c:CLASS)-->(b:METHOD)\n" +
        "WHERE a.name = b.name AND ID(a) <> ID(b)\n" +
        "WITH count(DISTINCT a) AS cnt, c\n" +
        "SET c.methodVariants = cnt - 1",{});
        await this.submitRequest("MATCH (c:CLASS)\n" +
        "WHERE NOT EXISTS(c.methodVariants)\n" +
        "SET c.methodVariants = 0",{});
    }

    async setConstructorVPs(): Promise<void>{
        await this.submitRequest("MATCH (c:CLASS)-->(a:CONSTRUCTOR)\n" +
        "WITH count(a.name) AS cnt, c\n" +
        "SET c.constructorVPs = CASE WHEN cnt > 1 THEN 1 ELSE 0 END",{});
        await this.submitRequest("MATCH (c:CLASS)\n" +
        "WHERE NOT EXISTS(c.constructorVPs)\n" +
        "SET c.constructorVPs = 0",{});
    }

    async setConstructorVariants(): Promise<void>{
        await this.submitRequest("MATCH (c:CLASS)-->(a:CONSTRUCTOR)\n" +
        "WITH count(a.name) AS cnt, c\n" +
        "SET c.constructorVariants = CASE WHEN cnt > 1 THEN cnt ELSE 0 END",{});
        await this.submitRequest("MATCH (c:CLASS)\n" +
        "WHERE NOT EXISTS(c.constructorVariants)\n" +
        "SET c.constructorVariants = 0",{});
    }

    async setNbVariantsProperty(): Promise<void>{
        await this.submitRequest("MATCH (c)-[:EXTENDS|IMPLEMENTS]->(sc:CLASS) WITH count(sc) AS nbVar, c SET c.classVariants = nbVar",{});
        await this.submitRequest("MATCH (c) WHERE ((c:CLASS OR c:INTERFACE) AND NOT EXISTS (c.classVariants)) SET c.classVariants = 0",{});
    }

    async setVPLabels(): Promise<void>{
        const clauseForHavingDesignPattern = Object.keys(DesignPatternType).map((nodeType) => "c:" + nodeType).join(" OR ");
        const request = "MATCH (c) WHERE (NOT c:OUT_OF_SCOPE)\n"
        +"AND (c:INTERFACE OR (c:CLASS AND c:ABSTRACT) OR ("+clauseForHavingDesignPattern+") OR (EXISTS(c.classVariants) AND c.classVariants > 0))\n"
        +"SET c:"+EntityAttribut.VP;
        await this.submitRequest(request,{});
    }

    async setMethodLevelVPLabels(): Promise<void>{
        const request = "MATCH (c) WHERE (NOT c:OUT_OF_SCOPE) AND (c.methodVPs > 0 OR c.constructorVPs > 0) SET c:" + EntityAttribut.METHOD_LEVEL_VP;
        await this.submitRequest(request, {});
    }

    async setVariantsLabels(): Promise<void>{
        const request = "MATCH (sc:VP)-[:EXTENDS|IMPLEMENTS]->(c) WHERE c:CLASS OR c:INTERFACE SET c:" + EntityAttribut.VARIANT;
        await this.submitRequest(request, {});
    }

    async setPublicMethods(): Promise<void>{
        await this.submitRequest("MATCH (c:CLASS:PUBLIC)-->(a:METHOD:PUBLIC)\n" +
        "WITH count( a.name ) AS cnt, c\n" +
        "SET c.publicMethods = cnt",{});
        await this.submitRequest("MATCH (c:CLASS)\n" +
        "WHERE NOT EXISTS(c.publicMethods)\n" +
        "SET c.publicMethods = 0",{});
    }

    async setPublicConstructors() {
        await this.submitRequest("MATCH (c)-->(a) \n" +
        "WHERE c:PUBLIC AND c:CLASS AND  a:CONSTRUCTOR AND a:PUBLIC\n" +
        "WITH count( a.name ) AS cnt, c\n" +
        "SET c.publicConstructors = cnt",{});
        await this.submitRequest("MATCH (c:CLASS)\n" +
        "WHERE NOT EXISTS(c.publicConstructors)\n" +
        "SET c.publicConstructors = 0",{});
    }

    async setNbCompositions(): Promise<void>{
        await this.submitRequest("MATCH (c)-[:INSTANTIATE]->(a) WITH count(a) AS nbComp, c SET c.nbCompositions = nbComp",{});
    }

    async setAllMethods(){
        await this.submitRequest("MATCH (c:CLASS)-->(a:METHOD)\n" +
        "WITH count( a.name ) AS cnt, c\n" +
        "SET c.allMethods = cnt", {});
        await this.submitRequest("MATCH (c:CLASS)\n" +
        "WHERE NOT EXISTS(c.allMethods)\n" +
        "SET c.allMethods = 0", {});
    }

    async setModuleVP(){
        const request = "MATCH (c1:CLASS) MATCH (c2:CLASS)\n"+
        "WHERE c1.name = c2.name\n" +
        "AND ID(c1)<>ID(c2)\n" +
        "SET c1:"+EntityAttribut.MODULE_VP+"\n" +
        "SET c2:"+EntityAttribut.MODULE_VP;
        await this.submitRequest(request,{});
    }

    async setModuleVariant(){
        const request = "MATCH (m:MODULE)-[:EXPORT]->(c:MODULE_VP) SET m:"+EntityAttribut.MODULE_VARIANT;
        await this.submitRequest(request, {});  
    }

    async detectStrategiesWithComposition(){
        const request = "MATCH (c)-[:INSTANTIATE]->(c1) " +
        "WHERE (c:CLASS OR c:INTERFACE) AND (EXISTS(c1.classVariants) AND c1.classVariants > 1) " +
        "SET c1:" + DesignPatternType.COMPOSITION_STRATEGY;
        await this.submitRequest(request, {});
    }

    async detectDensity(): Promise<void>{
        await this.submitRequest("MATCH (v1:VARIANT)-[:INSTANTIATE]->(v2:VARIANT) " +
        "SET v1:DENSE SET v2:DENSE", {});
    }

    async getTotalNbVPs(): Promise<number>{
        return (await this.getNbClassLevelVPs()) + (await this.getNbMethodLevelVPs());
    }

    async getNbClassLevelVPs(): Promise<number>{
        return this.submitRequest("MATCH (c:VP) RETURN COUNT (DISTINCT c)", {}).then((result: Record[]) =>{
            return +(result[0].get(0));
        });
    }

    async getNbMethodLevelVPs(): Promise<number>{
        return await this.getNbMethodVPs() + await this.getNbConstructorVPs();
    }

    async getNbMethodVPs() : Promise<number>{
        return this.submitRequest("MATCH (c:CLASS) RETURN (SUM(c.methodVPs))", {}).then((result: Record[]) =>{
            return +(result[0].get(0));
        });
    }

    async getNbConstructorVPs() : Promise<number>{
        return this.submitRequest("MATCH (c:CLASS) RETURN (SUM(c.constructorVPs))", {}).then((result: Record[]) =>{
            return +(result[0].get(0));
        });
    }

    async getTotalNbVariants(): Promise<number>{
        return await this.getNbClassLevelVariants() + await this.getNbMethodLevelVariants();
    }

    async getNbClassLevelVariants(): Promise<number>{
        return this.submitRequest("MATCH (c:VARIANT) WHERE NOT c:VP RETURN (COUNT(DISTINCT c))", {}).then((result: Record[]) =>{
            return +(result[0].get(0));
        });
    }

    async getNbMethodLevelVariants(): Promise<number>{
        return await this.getNbMethodVariants() + await this.getNbConstructorVariants();
    }

    async getNbMethodVariants(): Promise<number>{
        return this.submitRequest("MATCH (c:CLASS) RETURN (SUM(c.methodVariants))", {}).then((result: Record[]) =>{
            return +(result[0].get(0));
        });
    }

    async getNbConstructorVariants(): Promise<number>{
        return this.submitRequest("MATCH (c:CLASS) RETURN (SUM(c.constructorVariants))", {}).then((result: Record[]) =>{
            return +(result[0].get(0));
        });
    }

    async getNbNodes(): Promise<number>{
        return this.submitRequest("MATCH(n) RETURN count(*)", {}).then((result: Record[]) =>{
            return +(result[0].get(0));
        });
    }

    async getNbRelationships(): Promise<number>{
        return this.submitRequest("MATCH (n)-[r]->() RETURN COUNT(r)", {}).then((result: Record[]) =>{
            return +(result[0].get(0));
        });
    }

    async clearNodes(): Promise<void>{
        const request = "MATCH (n) DETACH DELETE n"
        await this.submitRequest(request, {});
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