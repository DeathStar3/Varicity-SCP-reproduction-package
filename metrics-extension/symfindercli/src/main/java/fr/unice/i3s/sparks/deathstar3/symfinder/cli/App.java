package fr.unice.i3s.sparks.deathstar3.symfinder.cli;


import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fr.unice.i3s.sparks.deathstar3.deserializer.ConfigLoader;
import fr.unice.i3s.sparks.deathstar3.deserializer.SymfinderConfigParser;
import fr.unice.i3s.sparks.deathstar3.entrypoint.MetricExtensionEntrypoint;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriter;
import fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterHttp;
import fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterJson;
import lombok.extern.slf4j.Slf4j;

/**
 *
 */
@Slf4j
public final class App {

   @Parameter(names = {"-i"}, description = "The path of the configuration of the experiment you want to run", required = true)
   private String configFilePath;

   @Parameter(names = "-s", description = "The Path of the configuration of Symfinder (YAML)", required = true)
   private String symfinderConfiguration;

   @Parameter(names = "-verbosity")
   private String logLevel="INFO";

   @Parameter(names = "-http", description = "Url of a server where to post the results")
   private String serverUrl=null;

    @Parameter(names = "--help", help = true)
    private boolean help;




    private static final List<String> VALID_LEVELS = Arrays.asList("TRACE", "DEBUG", "INFO", "WARN", "ERROR");
    private App() {
    }

    /**
     * Says hello to the world.
     * @param args The arguments of the program.
     */
    public static void main(String[] args)  {

        System.setProperty("logfilename", Optional.ofNullable(System.getenv("PROJECT_NAME")).orElse("debug.log"));
        App app =new App();
        JCommander.newBuilder()
            .addObject(app)
            .build()
            .parse(args);

        app.run();

    }

    private void run(){

        if(help){
            System.out.println("""
                Symfinder version ....
                """);
            System.exit(0);
        }

        if (VALID_LEVELS.contains(logLevel.toUpperCase())) {
            System.setProperty(org.slf4j.impl.SimpleLogger.DEFAULT_LOG_LEVEL_KEY, logLevel);
            Logger root = LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
            root.trace("This is a trace");
            root.info("This is info");
        }

        ConfigLoader configLoader = new ConfigLoader();
        SymfinderConfigParser symfinderConfigParser = new SymfinderConfigParser();
        List<ExperimentConfig> configs = configLoader.loadConfigFile(configFilePath);
        MetricExtensionEntrypoint metricExtension = new MetricExtensionEntrypoint();

        ExperimentConfig firstConfig = configs.get(0);

        List<ExperimentResult> results = metricExtension.runExperiment(firstConfig, symfinderConfigParser.parseSymfinderConfigurationFromFile(symfinderConfiguration).hotspots() );

        ExperimentResultWriter experimentResultWriter;
        if(this.serverUrl!=null && !this.serverUrl.isBlank()){
            experimentResultWriter=new ExperimentResultWriterHttp(this.serverUrl);

        }else{
            experimentResultWriter  = new ExperimentResultWriterJson(firstConfig);
        }


        for(ExperimentResult result:results){
            try {
                experimentResultWriter.writeResult(result);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }


        System.exit(0);
    }
}
