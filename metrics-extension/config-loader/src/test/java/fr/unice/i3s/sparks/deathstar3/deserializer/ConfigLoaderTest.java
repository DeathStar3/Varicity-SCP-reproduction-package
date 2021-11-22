package fr.unice.i3s.sparks.deathstar3.deserializer;

import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.assertNotNull;

public class ConfigLoaderTest {

    private ConfigLoader configLoader = new ConfigLoader();

    @Test
    public void loadConfigFromStringTest() throws IOException {
        var source = new String(
                ConfigLoaderTest.class.getClassLoader().getResourceAsStream("config.yaml").readAllBytes());
        var config = this.configLoader.deserializeConfigFile(source);

        Assert.assertEquals(config.get(0).getProjectName(), "jfreechart");
    }

}
