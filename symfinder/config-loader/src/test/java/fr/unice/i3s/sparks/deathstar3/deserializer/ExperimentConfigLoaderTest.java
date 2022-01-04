package fr.unice.i3s.sparks.deathstar3.deserializer;

import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;

public class ExperimentConfigLoaderTest {

    private ConfigLoader configLoader = new ConfigLoader();

    @Test
    public void loadConfigFromStringTest() throws IOException {
        var source = new String(
                ExperimentConfigLoaderTest.class.getClassLoader().getResourceAsStream("config.yaml").readAllBytes());
        var config = this.configLoader.deserializeConfigsFromString(source);

        Assert.assertEquals(config.get(0).getProjectName(), "jfreechart");
    }

}
