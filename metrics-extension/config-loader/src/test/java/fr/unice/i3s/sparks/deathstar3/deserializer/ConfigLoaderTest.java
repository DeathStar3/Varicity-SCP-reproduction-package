package fr.unice.i3s.sparks.deathstar3.deserializer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.model.Config;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.util.HashMap;

import static org.junit.Assert.assertNotNull;

public class ConfigLoaderTest {


    private ConfigLoader configLoader=new ConfigLoader();
    @Test
    public void loadConfigFromStringTest() throws IOException {
       var source= new String(ConfigLoaderTest.class.getClassLoader().getResourceAsStream("config.yaml").readAllBytes());
       var config= this.configLoader.loadConfigFromString(source);

        Assert.assertEquals(config.getProjectName() , "jfreechart");
    }

}
