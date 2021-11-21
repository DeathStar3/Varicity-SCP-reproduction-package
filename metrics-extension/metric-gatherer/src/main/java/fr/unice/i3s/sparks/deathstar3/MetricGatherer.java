package fr.unice.i3s.sparks.deathstar3;

import fr.unice.i3s.sparks.deathstar3.model.Config;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import fr.unice.i3s.sparks.deathstar3.strategy.MetricGathering;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud.SonarCloudStrategy;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarqube.SonarQubeStrategy;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@NoArgsConstructor
public class MetricGatherer {

    public void gatherMetrics(Config config) {

        List<Thread> threads = new ArrayList<>();

        for (MetricSource metricSource : config.getSources()) {
            if (metricSource.isEnabled()) {

                Thread t = new Thread() {
                    public void run() {

                        MetricGathering strategy = strategySelection(metricSource.getName());

                        if (strategy != null) {
                            String outputFileName = config.getOutputPath() + "/" + metricSource.getName() + "/"
                                    + config.getProjectName();
                            strategy.gatherAndSaveMetrics(metricSource.getSourceUrl(), metricSource.getMetrics(),
                                    outputFileName);
                        }
                        log.info("The metrics from " + metricSource.getName() + " were collected and saved (json)");
                    }
                };
                threads.add(t);
            }
        }

        // Start all the threads
        for (Thread t : threads) {
            t.start();
        }

        // Join all the threads
        for (Thread t : threads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        log.info("Metrics-extension process completed!");
    }

    public MetricGathering strategySelection(String sourceName) {
        switch (sourceName) {
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
