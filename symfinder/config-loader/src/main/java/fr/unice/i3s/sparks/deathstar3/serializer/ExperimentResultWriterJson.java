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
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Slf4j
public class ExperimentResultWriterJson implements ExperimentResultWriter {

    ObjectMapper objectMapperJson = new ObjectMapper();
    private ExperimentConfig experimentConfig;

    public ExperimentResultWriterJson(ExperimentConfig experiment) {
        this.experimentConfig = experiment;

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
            log.info("JSON path : " + file.toPath());
            //writing the result
            ExperimentResultWriter.writeToFile(file.toPath(), experimentResult.getSymfinderResult().vpJsonGraph());

            file = Paths.get(experimentConfig.getOutputPath(), "/symfinder_files/", experimentResult.getProjectName() + "-stats" + ".json").toFile();
            log.info("JSON stats path : " + file.toPath());

            //writing the statistics of the analysis
            ExperimentResultWriter.writeToFile(file.toPath(), experimentResult.getSymfinderResult().statisticJson());
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

    public static Path getSymfinderJSONOutputPath(String outputPath, String projectName) {
        return Paths.get(outputPath, "/symfinder_files/", projectName + ".json");
    }

    public static Path getSymfinderStatsJSONOutputPath(String outputPath, String projectName) {
        return Paths.get(outputPath, "/symfinder_files/", projectName + "-stats" + ".json");
    }

}
