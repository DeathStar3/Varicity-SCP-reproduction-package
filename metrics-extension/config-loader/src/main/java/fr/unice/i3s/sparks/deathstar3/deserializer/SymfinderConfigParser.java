

/*
 *
 *  This file is part of symfinder.
 *
 *  symfinder is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  symfinder is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 *  Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 *  Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 *  Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 *
 */

package fr.unice.i3s.sparks.deathstar3.deserializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.ParametersObject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class SymfinderConfigParser {

    public ParametersObject parseSymfinderConfigurationFromString(String yamlString) {

        ObjectMapper objectMapperYaml = new ObjectMapper(new YAMLFactory());
        try {
            return objectMapperYaml.readValue(yamlString, ParametersObject.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public ParametersObject parseSymfinderConfigurationFromFile(String pathOfYaml) {
        try {
            return this.parseSymfinderConfigurationFromString(Files.readString(Path.of(pathOfYaml)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
