package fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarqube;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.model.SonarMetricAvailable;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud.SonarCloudStrategy;
import fr.unice.i3s.sparks.deathstar3.utils.HttpRequest;

public class SonarQubeStrategy extends SonarCloudStrategy {

    private final ObjectMapper objectMapper = new ObjectMapper(new YAMLFactory());
    private final HttpRequest httpRequest = new HttpRequest();

    /**
     * In case of error we will display the available metrics
     */
    @Override
    public void displayAvailableMetrics(String rootUrl, String projectName) {

        String url = rootUrl + "/api/metrics/search?&component=" + projectName;

        try {
            String json = httpRequest.get(url);
            SonarMetricAvailable sonarMetricAvailable = objectMapper.readValue(json, SonarMetricAvailable.class);

            System.err.println("\n >>> Project Name: " + projectName + " (source = SonarQube)");
            sonarMetricAvailable.formatPrint();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
