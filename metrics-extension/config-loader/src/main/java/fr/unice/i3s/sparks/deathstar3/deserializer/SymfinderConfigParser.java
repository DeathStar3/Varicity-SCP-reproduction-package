package fr.unice.i3s.sparks.deathstar3.deserializer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.engine.configuration.ParametersObject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class SymfinderConfigParser {

    public ParametersObject parseSymfinderConfigurationFromString(String yamlString){

        ObjectMapper objectMapperYaml=new ObjectMapper(new YAMLFactory());
        try {
            return objectMapperYaml.readValue(yamlString,ParametersObject.class);
        } catch (JsonProcessingException e) {
           throw new RuntimeException(e);
        }
    }

    public ParametersObject parseSymfinderConfigurationFromFile(String pathOfYaml){
        try {
         return  this.parseSymfinderConfigurationFromString( Files.readString(Path.of(pathOfYaml)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
