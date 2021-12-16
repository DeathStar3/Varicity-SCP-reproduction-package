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

package fr.unice.i3s.sparks.deathstar3.serializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

public class ExperimentResultWriterJson implements ExperimentResultWriter {

    ObjectMapper objectMapperJson = new ObjectMapper();
    private ExperimentConfig experimentConfig;

    public ExperimentResultWriterJson(ExperimentConfig experiment) {
        this.experimentConfig = experiment;

        // if the output path is not defined a temporary one is created
        if (this.experimentConfig.getOutputPath() == null || this.experimentConfig.getOutputPath().isBlank()) {
            try {
                Path workingDirectory = Files.createTempDirectory("varicity-work-dir");
                this.experimentConfig.setOutputPath(workingDirectory.toAbsolutePath().toString());
            } catch (Exception e) {
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
        if (experimentResult.getSymfinderResult() != null) {
            File file = Paths.get(experimentConfig.getOutputPath(), "/symfinder_files/", experimentResult.getProjectName() + ".json").toFile();
            file.getParentFile().mkdirs();

            //writing the result
            writeToFile(file.toPath(), experimentResult.getSymfinderResult().vpJsonGraph());

            file = Paths.get(experimentConfig.getOutputPath(), "/symfinder_files/", experimentResult.getProjectName() + "-stats" + ".json").toFile();

            //writing the statistics of the analysis
            writeToFile(file.toPath(), experimentResult.getSymfinderResult().statisticJson());
        }

        //write quality metrics result

        if (experimentResult.getExternalMetric() != null) {
            for (Map.Entry<String, List<Node>> entry : experimentResult.getExternalMetric().entrySet()) {
                String sourceName = entry.getKey();
                List<Node> nodes = entry.getValue();
                File file = Paths.get(experimentConfig.getOutputPath(), "/symfinder_files/externals", experimentResult.getProjectName(), experimentResult.getProjectName() + "-" + sourceName + ".json").toFile();
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
