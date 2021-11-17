package fr.unice.i3s.sparks.deathstar3;

import fr.unice.i3s.sparks.deathstar3.model.Config;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.strategy.MetricGathering;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud.SonarCloudStrategy;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarqube.SonarQubeStrategy;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@NoArgsConstructor
public class MetricGatherer {

    public void gatherMetrics(Config config) {

        //TODO Run this in a thread
        for (MetricSource metricSource : config.getSources()) {
            if (metricSource.isEnabled()) {
                MetricGathering strategy = strategySelection(metricSource.getName());

                if (strategy != null) {
                    String outputFileName = config.getOutputPath() + "/" + metricSource.getName() + "/" + config.getProjectName();
                    strategy.gatherAndSaveMetrics(metricSource.getSourceUrl(), metricSource.getMetrics(), outputFileName);
                }
            }
        }
    }

    public MetricGathering strategySelection(String sourceName){
        switch (sourceName){
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
