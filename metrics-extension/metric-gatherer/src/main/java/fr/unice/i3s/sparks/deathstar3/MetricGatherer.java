package fr.unice.i3s.sparks.deathstar3;

import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.strategy.MetricGathering;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud.SonarCloudStrategy;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarqube.SonarQubeStrategy;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@NoArgsConstructor
public class MetricGatherer {

    /**
     * Gather for each source in Config the associate metrics
     */
    public List<Node> gatherMetrics(String projectName, MetricSource source) {

        MetricGathering strategy = strategySelection(source.getName());

        if (strategy != null) {

            List<Node> nodes = strategy.gatherAndSaveMetrics(source.getRootUrl(), source.getComponentName(), source.getMetrics());
            log.info("The metrics from " + projectName + ":" + source.getName() + " were collected and saved (json)");
            return nodes;
        } else {
            log.warn("Returning empty list");
            return List.of();
        }


    }

    /**
     * Select the Strategy to run using the sourceName
     */
    public MetricGathering strategySelection(String sourceName) {
        return switch (sourceName.toLowerCase()) {
            case "sonar-qube", "sonarqube" -> new MetricGathering(new SonarQubeStrategy());
            case "sonar-cloud", "sonarcloud" -> new MetricGathering(new SonarCloudStrategy());
            default -> null;
        };
    }
}
