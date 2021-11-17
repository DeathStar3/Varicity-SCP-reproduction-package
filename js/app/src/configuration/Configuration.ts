import * as yaml from "js-yaml"
import * as fs from "fs"

export class Configuration{

    properties: any = yaml.load(fs.readFileSync('./neo4j.yaml', 'utf8'));

    getNeo4JBoltAdress(): string{
        return this.properties.neo4j.boltAddress
    }

    getNeo4JUser(): string{
        return this.properties.neo4j.user
    }

    getNeo4JPassword(): string{
        return this.properties.neo4j.password
    }
}

const config = new Configuration()
export { config }