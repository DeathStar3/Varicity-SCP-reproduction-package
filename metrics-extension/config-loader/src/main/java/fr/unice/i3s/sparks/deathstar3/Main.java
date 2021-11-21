package fr.unice.i3s.sparks.deathstar3;

import fr.unice.i3s.sparks.deathstar3.model.Config;
import fr.unice.i3s.sparks.deathstar3.deserializer.ConfigLoader;

public class Main {

    public static void main(String[] args) {

        String configFilePath = "./metrics-extension/config/config.yaml"; // default config file path and file that will
                                                                          // be loaded

        if (args.length == 1) {
            configFilePath = args[0];
        }

        ConfigLoader configLoader = new ConfigLoader();
        Config config = configLoader.loadConfigFile(configFilePath);
        System.out.println(config);
        /*
         * 
         * MetricGatherer metricGatherer = new MetricGatherer(); metricGatherer.gatherMetrics(config);
         */

    }
}
