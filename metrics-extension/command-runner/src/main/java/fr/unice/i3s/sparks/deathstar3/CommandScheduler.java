package fr.unice.i3s.sparks.deathstar3;

import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.MetricSource;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class CommandScheduler {

    public void schedule(List<ExperimentConfig> configs) {

        MetricGatherer metricGatherer = new MetricGatherer();

        List<Thread> threads = new ArrayList<>();

        for (ExperimentConfig config : configs) {
            for (MetricSource source : config.getSources()) {
                if (source.isEnabled()) {

                    Thread t = new Thread(() -> {

                        new CommandRunner(source.getWorkingDirectory(), source.getShellLocation(), source.getCommands()).execute();
                        log.info("All commands from " + config.getProjectName() + ":" + source.getName() + " were executed");

                        metricGatherer.gatherMetrics(config.getProjectName(), config.getOutputPath(), source);
                    });
                    threads.add(t);
                }
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
        log.info("Metrics-extension process completed for all projects!");
        System.exit(0); //End of program
    }
}
