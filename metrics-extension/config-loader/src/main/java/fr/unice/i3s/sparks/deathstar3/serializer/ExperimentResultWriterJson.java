package fr.unice.i3s.sparks.deathstar3.serializer;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;

public class ExperimentResultWriterJson implements ExperimentResultWriter {

    ObjectMapper objectMapperJson = new ObjectMapper();
    private ExperimentConfig experimentConfig;

    public ExperimentResultWriterJson(ExperimentConfig experiment){
        this.experimentConfig = experiment;

        // if the output path is not defined a temporary one is created
        if (this.experimentConfig.getOutputPath() == null || this.experimentConfig.getOutputPath().isBlank()) {
            try {
                Path workingDirectory = Files.createTempDirectory("varicity-work-dir");
                this.experimentConfig.setOutputPath(workingDirectory.toAbsolutePath().toString());
            }catch (Exception e){
                e.printStackTrace();
            }

        }
    }
    @Override
    public void writeResult(ExperimentResult experimentResult) throws Exception {
        if (experimentResult == null) {
            return;
        }

        //write symfinder result
        if (experimentResult.symfinderResult() != null) {
            File file = Paths.get(experimentConfig.getOutputPath(), "/symfinder_files/", experimentResult.projectName() + ".json").toFile();
            file.getParentFile().mkdirs();

            //writing the result
            writeToFile(file.toPath(), experimentResult.symfinderResult().vpJsonGraph());

            file = Paths.get(experimentConfig.getOutputPath(), "/symfinder_files/", experimentResult.projectName() + "-stats" + ".json").toFile();

            //writing the statistics of the analysis
            writeToFile(file.toPath(), experimentResult.symfinderResult().statisticJson());
        }

        //write quality metrics result

        if (experimentResult.externalMetric() != null) {
            for (Map.Entry<String, List<Node>> entry : experimentResult.externalMetric().entrySet()) {
                String sourceName = entry.getKey();
                List<Node> nodes = entry.getValue();
                File file = Paths.get(experimentConfig.getOutputPath(), "/symfinder_files/externals", experimentResult.projectName(), experimentResult.projectName() + "-" + sourceName + ".json").toFile();
                if (file.getParentFile().exists() || (file.getParentFile().mkdirs() && file.createNewFile())) {
                    objectMapperJson.writeValue(file, nodes);
                }
            }
        }
    }

    private void writeToFile(Path path, String content) {
        try {
            if (path.toFile().getParentFile().exists() || (path.toFile().getParentFile().mkdirs() && path.toFile().createNewFile())) {
                try (BufferedWriter bw = Files.newBufferedWriter(path)) {
                    bw.write(content);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
