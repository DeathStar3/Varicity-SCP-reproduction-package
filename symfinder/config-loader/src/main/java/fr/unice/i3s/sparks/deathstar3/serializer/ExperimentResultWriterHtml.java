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

import fr.unice.i3s.sparks.deathstar3.model.ExperimentResult;
import fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.text.StringSubstitutor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class ExperimentResultWriterHtml implements ExperimentResultWriter {

    private String destinationPath;

    public ExperimentResultWriterHtml(String destinationPath) {

        this.destinationPath = destinationPath;

        Path.of(destinationPath).toFile().mkdirs();
    }

    private static File[] getResourceFolderFiles(String folder) {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        URL url = loader.getResource(folder);
        String path = url.getPath();
        return new File(path).listFiles();
    }

    /**
     * This implementation of ExperimentResultWriter generates the files neccessary for the Symfinder Visualization (without varicity)
     * @param experimentResult The result of an experiment (contains at least one of symfinder variability information and metrics information)
     * @throws Exception
     */
    @Override
    public void writeResult(ExperimentResult experimentResult) throws Exception {

        //copy the files from the resources directory
        //we use the resources directory a self contained solution

        //we can't copy a directory (and its contents) that is inside the resources folder at least not with a simple way that
        //would work when we are executing outside of a jar or inside of a jar ; see https://stackoverflow.com/questions/8797909/how-to-read-files-in-an-folder-inputstream#8797972
        //the solution we use here is the 'table of contents solution' ; there is a list of all files inside the folder

        var listofscripts = new BufferedReader(new InputStreamReader(ExperimentResultWriterHtml.class.getClassLoader().getResourceAsStream("d3/scripts/scripts-list.txt"),
                StandardCharsets.UTF_8)).lines().filter(line -> !line.isBlank()).collect(Collectors.toList());

        for (String scriptName :listofscripts) {
            if (!Files.exists(Path.of(destinationPath, "scripts",scriptName))) {
                FileUtils.copyInputStreamToFile(ExperimentResultWriterHtml.class.getClassLoader().getResourceAsStream("d3/scripts/"+scriptName), Path.of(destinationPath, "scripts",scriptName).toFile());
            }
        }

        if (!Files.exists(Path.of(this.destinationPath, "index.html"))) {
            FileUtils.copyInputStreamToFile(ExperimentResultWriterHtml.class.getClassLoader().getResourceAsStream("d3/index.html"), Path.of(this.destinationPath, "index.html").toFile());
        }
        if (!Files.exists(Path.of(this.destinationPath, "style.css"))) {
            FileUtils.copyInputStreamToFile(ExperimentResultWriterHtml.class.getClassLoader().getResourceAsStream("d3/style.css"), Path.of(this.destinationPath, "style.css").toFile());
        }
        if (!Files.exists(Path.of(this.destinationPath, "symfinder-icon.png"))) {
            FileUtils.copyInputStreamToFile(ExperimentResultWriterHtml.class.getClassLoader().getResourceAsStream("d3/symfinder-icon.png"), Path.of(this.destinationPath, "symfinder-icon.png").toFile());
        }
        if (!Files.exists(Path.of(this.destinationPath, "symfinder-legend.svg"))) {
            FileUtils.copyInputStreamToFile(ExperimentResultWriterHtml.class.getClassLoader().getResourceAsStream("d3/symfinder-legend.svg"), Path.of(this.destinationPath, "symfinder-legend.svg").toFile());
        }
        //generate the html from the template
        StringSubstitutor sub = new StringSubstitutor(this.valuesToReplace(experimentResult));
        String resolvedString = sub.replace(new String(ExperimentResultWriterHtml.class.getClassLoader().getResourceAsStream("d3/template.html").readAllBytes()));
        String templateComposition = sub.replace(new String(ExperimentResultWriterHtml.class.getClassLoader().getResourceAsStream("d3/templatecomposition.html").readAllBytes()));

        //write the html files generated from the template
        ExperimentResultWriter.writeToFile(Path.of(this.destinationPath, String.format("%s.html", experimentResult.getProjectName())), resolvedString);
        ExperimentResultWriter.writeToFile(Path.of(this.destinationPath, String.format("%s-composition.html", experimentResult.getProjectName())), templateComposition);

        //create the data directory if not exists
        File dataDirectory = Path.of(this.destinationPath, "data").toFile();
        if (!dataDirectory.exists()) {
            dataDirectory.mkdirs();
        }
        //write the result of symfinder
        if (experimentResult.getSymfinderResult() != null && experimentResult.getSymfinderResult().getVpJsonGraph() != null) {
            ExperimentResultWriter.writeToFile(Path.of(this.destinationPath, "data", String.format("%s.json", experimentResult.getProjectName())),
                    experimentResult.getSymfinderResult().getVpJsonGraph());

        }
        //write the stats of symfinder
        if (experimentResult.getSymfinderResult() != null && experimentResult.getSymfinderResult().getStatisticJson() != null) {
            ExperimentResultWriter.writeToFile(Path.of(this.destinationPath, "data", String.format("%s-stats.json", experimentResult.getProjectName())),
                    experimentResult.getSymfinderResult().getStatisticJson());

        }

        this.insertInIndex(experimentResult);

    }

    private void insertInIndex(ExperimentResult experimentResult) throws IOException {
        File indexFile = Path.of(this.destinationPath, "index.html").toFile();
        Document doc = Jsoup.parse(indexFile, "UTF-8", "");

        Element projects = doc.select("#list-tab").first();

        projects.append(String.format("<a href=\"%s\" class=\"list-group-item list-group-item-action\">%s</a>", experimentResult.getProjectName() + ".html", experimentResult.getProjectName()));

        FileUtils.writeStringToFile(indexFile, doc.outerHtml(), "UTF-8");
    }

    private Map<String, String> valuesToReplace(ExperimentResult experimentResult) {
        Map<String, String> valuesMap = new HashMap<>();
        valuesMap.put("title", experimentResult.getProjectName());
        valuesMap.put("identifier", String.format("%s generated by symfinder version %s", experimentResult.getProjectName(), Constants.getSymfinderVersion()));
        valuesMap.put("jsScriptFile", "symfinder.js");

        var filters = experimentResult.getExperimentConfig().getFilters();

        if (filters == null) {
            filters = List.of();
        }

        valuesMap.put("filters", filters.stream().map(v -> "\"" + v + "\"").collect(Collectors.joining(",")));
        System.out.println(valuesMap.get("filters"));

        var apiFilters = experimentResult.getExperimentConfig().getApiFilters();

        if (apiFilters == null) {
            apiFilters = List.of();
        }
        valuesMap.put("apiFilters", apiFilters.stream().map(v -> "\"" + v + "\"").collect(Collectors.joining(",")));

        valuesMap.put("compositionLevel", String.valueOf(experimentResult.getExperimentConfig().getCompositionLevel() > 0 ? experimentResult.getExperimentConfig().getCompositionLevel() : 1));

        valuesMap.put("compositionType", experimentResult.getExperimentConfig().getCompositionType() != null ? experimentResult.getExperimentConfig().getCompositionType() : "IN");

        valuesMap.put("jsonFile", Paths.get("data", String.format("%s.json", experimentResult.getProjectName())).toString());
        valuesMap.put("jsonStatsFile", Paths.get("data", String.format("%s-stats.json", experimentResult.getProjectName())).toString());
        valuesMap.put("jsonMetricsFile", Paths.get("data", String.format("%s-metrics.json.json", experimentResult.getProjectName())).toString());

        // valuesMap.put("jsonTracesFile", Paths.get("data",String.format("%s-traces.json", experimentResult.getProjectName())).toString());

        // =os.path.join("data", "" % xp_codename) if xp_config.get("traces", "") else "")

        return valuesMap;
    }

}
