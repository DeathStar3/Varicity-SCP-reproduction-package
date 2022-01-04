/*
 * This file is part of symfinder.
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
 */

package fr.unice.i3s.sparks.deathstar3.deserializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class ConfigLoader {

    private final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());

    /**
     * @param source a YAML string that contains configurations for experiments
     * @return the configurations parsed into Java objects
     */
    public List<ExperimentConfig> deserializeConfigsFromString(String source) {
        try {
            Map<String, ExperimentConfig> configsMap = mapper.readValue(source, new TypeReference<HashMap<String, ExperimentConfig>>() {
            });

            configsMap.forEach((name, config) -> {
                config.setProjectName(name);
            });

            List<ExperimentConfig> configs = new ArrayList<>(configsMap.values());

            //Check there is at least one config
            if (!configs.isEmpty()) {
                return configs;
            } else {
                throw new RuntimeException("No config found in source");
            }

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("Could not parse config");
    }

    /**
     * @param fileName path of a YAML file that contains configurations for experiments
     * @return the configurations parsed into Java objects
     */
    public List<ExperimentConfig> loadConfigFile(String fileName) {

        try {
            return deserializeConfigsFromString(Files.readString(Path.of(fileName)));
        } catch (IOException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("Could not load config file (" + fileName + ")");

    }

}
