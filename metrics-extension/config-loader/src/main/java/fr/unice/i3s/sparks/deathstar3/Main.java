package fr.unice.i3s.sparks.deathstar3;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import fr.unice.i3s.sparks.deathstar3.deserializer.ConfigLoader;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

@Slf4j
public class Main {

    private final static List<String> VALID_LEVELS = Arrays.asList("TRACE", "DEBUG", "INFO", "WARN", "ERROR");

    public static void main(String[] args) {

        String configFilePath = "./metrics-extension/config/config.yaml"; // default config file path and file that will be loaded

        if (args.length >= 1) {
            configFilePath = args[0];
            if (args.length == 2) {
                if (VALID_LEVELS.contains(args[1].toUpperCase())) {
                    Logger root = (Logger) LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME);
                    root.setLevel(Level.valueOf(args[1].toUpperCase()));
                }
            }
        }

        // TODO Filter configFile to call project builder and test runner one one side and directly MetricGatherer for the rest

        ConfigLoader configLoader = new ConfigLoader();
        List<ExperimentConfig> configs = configLoader.loadConfigFile(configFilePath);

        CommandScheduler scheduler = new CommandScheduler();
        scheduler.schedule(configs);

    }
}
