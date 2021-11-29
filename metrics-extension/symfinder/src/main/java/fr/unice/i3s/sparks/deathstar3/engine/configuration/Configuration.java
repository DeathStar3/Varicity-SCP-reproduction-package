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
 * Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 * Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 * Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

package fr.unice.i3s.sparks.deathstar3.engine.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import java.io.FileInputStream;
import java.io.IOException;

public class Configuration {

    private ParametersObject properties;

    public Configuration() {
        this("symfinder.yaml");
    }

    public Configuration(ParametersObject properties) {
        this.properties = properties;
    }

    private Configuration(String propertiesFile) {
        try (FileInputStream fis = new FileInputStream(propertiesFile)) {
            ObjectMapper objectMapperYaml = new ObjectMapper(new YAMLFactory());
            properties = objectMapperYaml.readValue(fis, ParametersObject.class);
        } catch (IOException e) {
            e.printStackTrace(); // TODO: 11/28/18 create exception
        }
    }

    public String getNeo4JBoltAddress() {
        return properties.neo4j().boltAddress();
    }

    public String getNeo4JUser() {
        return properties.neo4j().user();
    }

    public String getNeo4JPassword() {
        return properties.neo4j().password();
    }

    public int getSingularityThreshold() {
        return properties.hotspots().nbVariantsThreshold();
    }

    public int getAggregationThreshold() {
        return properties.hotspots().nbAggregationsThreshold();
    }

}
