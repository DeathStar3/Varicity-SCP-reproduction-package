package fr.unice.i3s.sparks.deathstar3.deserializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.model.Config;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
public class ConfigLoader {

    private final ObjectMapper mapper = new ObjectMapper(new YAMLFactory());

    /**
     * Parse the config file
     */
    public Config deserializeConfigFile(String source) {
        try {
            Map<String, Config> configs = mapper.readValue(source, new TypeReference<HashMap<String, Config>>() {
            });

            configs.forEach((name, config) -> {
                config.setProjectName(name);
            });

            //Check there is at least one config
            Optional<Config> configOptional = configs.values().stream().findFirst();
            if (configOptional.isPresent()) {
                return configOptional.get();
            } else {
                throw new RuntimeException("No config found in source");
            }

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("Could not parse config");
    }

    /**
     * Load the config file
     */
    public Config loadConfigFile(String fileName) {

        try {
            return deserializeConfigFile(Files.readString(Path.of(fileName)));
        } catch (IOException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("Could not load config file (" + fileName + ")");

    }

}
