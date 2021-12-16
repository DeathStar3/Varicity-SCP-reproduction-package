/*
 * This file is part of symfinder.
 *
 *  symfinder is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  symfinder is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 *  Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 *  Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 *  Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

package fr.unice.i3s.sparks.deathstar3.symfinder.cli;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import fr.unice.i3s.sparks.deathstar3.deserializer.ConfigLoader;
import fr.unice.i3s.sparks.deathstar3.deserializer.SymfinderConfigParser;
import fr.unice.i3s.sparks.deathstar3.entrypoint.MetricExtensionEntrypoint;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants;
import fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriter;
import fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterHttp;
import fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterJson;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;
import java.util.logging.Level;

/**
 *
 */
@Slf4j
public final class App {

    @Parameter(names = {
        "-i"}, description = "The path of the configuration of the experiment you want to run", required = true)
    private String configFilePath;

    @Parameter(names = "-s", description = "The Path of the configuration of Symfinder (YAML)", required = true)
    private String symfinderConfiguration;

    @Parameter(names = "-verbosity")
    private String logLevel = "INFO";

    @Parameter(names = "-http", description = "Url of a server where to post the results")
    private String serverUrl = null;

    @Parameter(names = "--help", help = true)
    private boolean help;

    private App() {
    }

    /**
     * Says hello to the world.
     *
     * @param args The arguments of the program.
     */
    public static void main(String[] args) {

        System.setProperty("logfilename", Optional.ofNullable(System.getenv("PROJECT_NAME")).orElse("debug.log"));
        App app = new App();
        JCommander.newBuilder()
            .addObject(app)
            .build()
            .parse(args);

        app.setLogLevel();
        app.run();
    }

    private void printVersion() {
        System.out.println("Symfinder version " + Constants.getSymfinderVersion());
    }

    private void setLogLevel() {
        String envLogLevel = System.getenv("SYMFINDER_LOG_LEVEL");
        Level level = Level.OFF;
        if (envLogLevel != null) {
            try {
                level = Level.parse(envLogLevel);
            } catch (IllegalArgumentException ignored) {
            }
        }
        if (logLevel != null) {
            try {
                level = Level.parse(logLevel);
            } catch (IllegalArgumentException ignored) {
            }
        }
        System.out.println("Log Level is set to " + level + ". The underlying factory being used is "
            + org.slf4j.impl.StaticLoggerBinder.getSingleton().getLoggerFactoryClassStr());
        java.util.logging.Logger.getLogger("").setLevel(Level.parse(logLevel));
    }

    private void run() {

        if (help) {
            this.printVersion();
            System.exit(0);
        }

        SymfinderConfigParser symfinderConfigParser = new SymfinderConfigParser();
        MetricExtensionEntrypoint metricExtension = new MetricExtensionEntrypoint();

        ConfigLoader configLoader = new ConfigLoader();
        List<ExperimentConfig> configs = configLoader.loadConfigFile(configFilePath);

        for (ExperimentConfig firstConfig : configs) {
            List<ExperimentResult> results = metricExtension.runExperiment(firstConfig,
                symfinderConfigParser.parseSymfinderConfigurationFromFile(symfinderConfiguration).hotspots());

            ExperimentResultWriter experimentResultWriter;
            if (this.serverUrl != null && !this.serverUrl.isBlank()) {
                experimentResultWriter = new ExperimentResultWriterHttp(this.serverUrl);

            } else {
                experimentResultWriter = new ExperimentResultWriterJson(firstConfig);
            }

            for (ExperimentResult result : results) {
                try {
                    experimentResultWriter.writeResult(result);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        System.exit(0);
    }
}
