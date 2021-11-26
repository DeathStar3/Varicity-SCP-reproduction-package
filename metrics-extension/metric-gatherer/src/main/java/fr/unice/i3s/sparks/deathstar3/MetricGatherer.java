package fr.unice.i3s.sparks.deathstar3;

import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.strategy.MetricGathering;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud.SonarCloudStrategy;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarqube.SonarQubeStrategy;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@NoArgsConstructor
public class MetricGatherer {

    /**
     * Gather for each source in Config the associate metrics
     */
    public void gatherMetrics(String projectName, String outputPath, MetricSource source) {

        MetricGathering strategy = strategySelection(source.getName());

        if (strategy != null) {
            String outPath = outputPath + "/" + projectName + "/" + projectName + "-" + source.getName();
            strategy.gatherAndSaveMetrics(source.getRootUrl(), source.getComponentName(), source.getMetrics(), outPath);
        }

        log.info("The metrics from " + projectName + ":" + source.getName() + " were collected and saved (json)");
    }

    /**
     * Select the Strategy to run using the sourceName
     */
    public MetricGathering strategySelection(String sourceName) {
        switch (sourceName.toLowerCase()) {
            case "sonar-qube":
            case "sonarqube":
                return new MetricGathering(new SonarQubeStrategy());
            case "sonar-cloud":
            case "sonarcloud":
                return new MetricGathering(new SonarCloudStrategy());
            default:
                return null;
        }
    }
}
