/*
 * This file is part of symfinder.
 *
 * symfinder is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * symfinder is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2021-2022 Bruel Martin <martin.bruel999@gmail.com>
 */
import { load } from "js-yaml"
import { readFileSync } from "fs"
import { log } from "console";

export class Configuration{

    runner: string;
    properties: any;

    constructor(runner: string) {
        this.runner = runner;
        if (this.runner === "docker") {
            this.properties = load(readFileSync('./neo4j_docker.yaml', 'utf8'));
        } else {
            this.properties = load(readFileSync('./neo4j.yaml', 'utf8'));
        }
    }

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