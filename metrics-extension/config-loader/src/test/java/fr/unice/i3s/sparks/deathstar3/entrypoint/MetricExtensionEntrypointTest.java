package fr.unice.i3s.sparks.deathstar3.entrypoint;


import fr.unice.i3s.sparks.deathstar3.deserializer.ConfigLoader;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.HotspotsParameters;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.Neo4jParameters;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration.ParametersObject;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterJson;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.List;

public class MetricExtensionEntrypointTest {


    private MetricExtensionEntrypoint entrypoint = new MetricExtensionEntrypoint();

    private ConfigLoader configLoader = new ConfigLoader();

    /**
     * This test will check if the extension still accepts the initial format of experiment
     */
    @Test
    void nonRegressionTest() throws IOException {
        ParametersObject parametersObject = new ParametersObject(new Neo4jParameters("bolt://localhost:7687", "", ""),
                new HotspotsParameters(20, 5), "");


        ExperimentConfig cfclient = this.configLoader.deserializeConfigFile(new String(MetricExtensionEntrypointTest.class.getClassLoader().
                getResourceAsStream("legacy-experiments-non-regression.yaml").readAllBytes())).get(0);

        System.out.println(cfclient);


        Assertions.assertDoesNotThrow(() -> {
            ExperimentResult experimentResult = this.entrypoint.runSimpleExperiment(cfclient, parametersObject.hotspots());
            System.out.println(experimentResult);
            Assertions.assertNotNull(experimentResult);
            Assertions.assertNotNull(experimentResult.symfinderResult());
            Assertions.assertTrue(experimentResult.externalMetric().isEmpty());

        });

    }

    @Test
    void runExperimentTest() throws IOException {
        ParametersObject parametersObject = new ParametersObject(new Neo4jParameters("bolt://localhost:7687", "", ""),
                new HotspotsParameters(20, 5), "");

        ExperimentConfig cfclient = this.configLoader.deserializeConfigFile(new String(MetricExtensionEntrypointTest.class.getClassLoader().
                getResourceAsStream("experiment-cookie-factory-config.yaml").readAllBytes())).get(0);

        System.out.println(cfclient);

        Assertions.assertDoesNotThrow(() -> {
            ExperimentResult experimentResult = this.entrypoint.runSimpleExperiment(cfclient, parametersObject.hotspots());
            Assertions.assertNotNull(experimentResult);
            Assertions.assertNotNull(experimentResult.symfinderResult());
            System.out.println(experimentResult);

            Assertions.assertFalse(experimentResult.externalMetric().isEmpty());

        });


    }

    @Test
    void whenSkipSymfinderIsTrueAndMetricSourceIsInriaSonarQube() throws IOException {
        ParametersObject parametersObject = new ParametersObject(new Neo4jParameters("bolt://localhost:7687", "", ""),
                new HotspotsParameters(20, 5), "");

        ExperimentConfig iutas201 = this.configLoader.deserializeConfigFile(new String(MetricExtensionEntrypointTest.class.getClassLoader().
                getResourceAsStream("iutas201_vehicule.yaml").readAllBytes())).get(0);

        System.out.println(iutas201);

        Assertions.assertDoesNotThrow(() -> {
            ExperimentResult experimentResult = this.entrypoint.runSimpleExperiment(iutas201, parametersObject.hotspots());

            System.out.println(experimentResult);
            Assertions.assertNotNull(experimentResult);
            Assertions.assertNotNull(experimentResult.symfinderResult());
            Assertions.assertEquals("", experimentResult.symfinderResult().vpJsonGraph(), "Symfinder is not executed so its result should be empty.");
            Assertions.assertEquals("", experimentResult.symfinderResult().statisticJson(), "Symfinder is not executed so its result should be empty.");

            Assertions.assertFalse(experimentResult.externalMetric().isEmpty());

            Assertions.assertNotNull(experimentResult.externalMetric().get("sonarcloud"));

            Assertions.assertFalse(experimentResult.externalMetric().get("sonarcloud").isEmpty());

        });


    }

    @Test
    void whenSkipSymfinderIsTrueAndMetricSourceIsLocalSonarQube() throws IOException {
        ParametersObject parametersObject = new ParametersObject(new Neo4jParameters("bolt://localhost:7687", "", ""),
                new HotspotsParameters(20, 5), "");

        ExperimentConfig regatta = this.configLoader.deserializeConfigFile(new String(MetricExtensionEntrypointTest.class.getClassLoader().
                getResourceAsStream("regatta.yaml").readAllBytes())).get(0);

        System.out.println(regatta);

        Assertions.assertDoesNotThrow(() -> {
            ExperimentResult experimentResult = this.entrypoint.runSimpleExperiment(regatta, parametersObject.hotspots());

            System.out.println(experimentResult);

            Assertions.assertNotNull(experimentResult);
            Assertions.assertNotNull(experimentResult.symfinderResult());
            Assertions.assertEquals("", experimentResult.symfinderResult().vpJsonGraph(), "Symfinder is not executed so its result should be empty.");
            Assertions.assertEquals("", experimentResult.symfinderResult().statisticJson(), "Symfinder is not executed so its result should be empty.");

            Assertions.assertFalse(experimentResult.externalMetric().isEmpty());
            Assertions.assertNotNull(experimentResult.externalMetric().get("sonarqube"));
            Assertions.assertFalse(experimentResult.externalMetric().get("sonarqube").isEmpty());

        });
    }


    @Test
    void runExperimentOnRegattaWithSymfinderAndSonarqube() throws IOException {
        ParametersObject parametersObject = new ParametersObject(new Neo4jParameters("bolt://localhost:7687", "", ""),
                new HotspotsParameters(20, 5), "");

        ExperimentConfig regatta = this.configLoader.deserializeConfigFile(new String(MetricExtensionEntrypointTest.class.getClassLoader().
                getResourceAsStream("regatta-with-symfinder.yaml").readAllBytes())).get(0);

        System.out.println(regatta);

        Assertions.assertDoesNotThrow(() -> {
            ExperimentResult experimentResult = this.entrypoint.runSimpleExperiment(regatta, parametersObject.hotspots());

            System.out.println(experimentResult);

            Assertions.assertNotNull(experimentResult);
            Assertions.assertNotNull(experimentResult.symfinderResult());

            
            Assertions.assertFalse(experimentResult.externalMetric().isEmpty());
            Assertions.assertNotNull(experimentResult.externalMetric().get("sonarqube"));
            Assertions.assertFalse(experimentResult.externalMetric().get("sonarqube").isEmpty());

        });
    }

    @Test
    void runExperimentWithMultipleTagsAndCommits() throws  IOException{
        HotspotsParameters hotspotsParameters = new HotspotsParameters(20, 5);

        ExperimentConfig cf = this.configLoader.deserializeConfigFile(new String(MetricExtensionEntrypointTest.class.getClassLoader().
                getResourceAsStream("experiment-cookie-factory-config-multiple-tags.yaml").readAllBytes())).get(0);

        List<ExperimentResult> experimentResultList= this.entrypoint.runExperiment(cf, hotspotsParameters );
        Assertions.assertEquals(4, experimentResultList.size());

        ExperimentResultWriterJson experimentResultWriterJson = new ExperimentResultWriterJson(cf);

        for(ExperimentResult result:experimentResultList){
            try {
                experimentResultWriterJson.writeResult(result);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
