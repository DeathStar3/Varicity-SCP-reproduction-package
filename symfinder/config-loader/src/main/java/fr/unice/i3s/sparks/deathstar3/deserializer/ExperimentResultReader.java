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

package fr.unice.i3s.sparks.deathstar3.deserializer;

import fr.unice.i3s.sparks.deathstar3.model.ExperimentConfig;
import fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterJson;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.result.SymfinderResult;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ExperimentResultReader {

    private ExperimentConfig experimentConfig;
    private String projectName;

    public ExperimentResultReader(ExperimentConfig experimentConfig, String projectName) {
        this.experimentConfig = experimentConfig;
        this.projectName = projectName;
    }

    public SymfinderResult getSymfinderResultFromExistingAnalysis() {
        return new SymfinderResult(readFromFile(ExperimentResultWriterJson.getSymfinderJSONOutputPath(experimentConfig.getOutputPath(), projectName)),
                readFromFile(ExperimentResultWriterJson.getSymfinderStatsJSONOutputPath(experimentConfig.getOutputPath(), projectName)));
    }

//    /data/symfinder_files/XX.json
    static String readFromFile(Path path) {
        StringBuilder resultStringBuilder = new StringBuilder();
        if (path.toFile().getParentFile().exists()) {
            try (BufferedReader br = Files.newBufferedReader(path)) {
                String line;
                while ((line = br.readLine()) != null) {
                    resultStringBuilder.append(line).append("\n");
                }
                return resultStringBuilder.toString();
            } catch (IOException e) {
                e.printStackTrace();
            }
            System.out.println("Path " + path + " exists!");
        } else {
            System.out.println("Path " + path + " does not exist.");
        }
        return "";
    }

}
