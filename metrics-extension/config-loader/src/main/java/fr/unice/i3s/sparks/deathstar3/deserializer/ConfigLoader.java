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

@Slf4j
public class ConfigLoader {

    private final ObjectMapper om = new ObjectMapper(new YAMLFactory());
    public Config loadConfigFromString(String source){
        try {
            var exps= om.readValue(source, new TypeReference<HashMap<String, Config>>() {});
            exps.forEach((name, exp)->{
                exp.setProjectName(name);
            });
            var optExp= exps.values().stream().findFirst();
            if(optExp.isPresent()){
                return optExp.get();
            }
            else{
                throw new RuntimeException("No config found in source");
            }

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("Could not parse config");
    }



    public Config loadConfigFile(String fileName) {
        try {
            return loadConfigFromString(Files.readString(Path.of(fileName)));
        } catch (IOException e) {
            e.printStackTrace();
        }
        throw new RuntimeException("Could not load config file (" +  fileName + ")");

    }


}
