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

package fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.exception.HttpResponseException;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Metric;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.strategy.MetricGatheringStrategy;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.model.SonarMetricAvailable;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.model.SonarResults;
import fr.unice.i3s.sparks.deathstar3.utils.HttpRequest;
import org.apache.hc.core5.http.HttpStatus;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class SonarCloudStrategy implements MetricGatheringStrategy {

    private final ObjectMapper objectMapper = new ObjectMapper(new YAMLFactory());
    private final HttpRequest httpRequest = new HttpRequest();

    @Override
    public List<Node> getMetrics(String sourceUrl, String componentName, List<String> metricNames) throws IOException {

        if (! sourceUrl.endsWith("/")) {
            sourceUrl += "/";
        }
        SonarResults sonarResults = performHttpRequest(sourceUrl, componentName, metricNames);
        return formatResults(sonarResults);
    }

    /**
     * Query the Sonar API (https://sonarcloud.io/web_api/api/measures) to retrieve the metrics wanted
     */
    public SonarResults performHttpRequest(String rootUrl, String componentName, List<String> metricNames) throws IOException {

        int numElementsPerPage = 500;

        String baseUrl = rootUrl + "api/measures/component_tree?component=" + componentName + "&metricKeys=" + String.join(",", metricNames) + "&ps=" + numElementsPerPage; //TODO Manage API errors when the metric asked is not found by sonar

        SonarResults sonarResults = new SonarResults();
        sonarResults.setComponents(new ArrayList<>());

        int page = 1;
        do {
            String json = null;
            try {
                // Make the http request to Sonar Cloud
                json = httpRequest.get(baseUrl + "&p=" + page);
            } catch (HttpResponseException e) {
                e.printStackTrace();

                if (e.getCode() == HttpStatus.SC_NOT_FOUND) {
                    //TODO make the distinction between the fact that a metrics is not found and the fact that the project is not found
                    //Display the available metrics for the project
                    displayAvailableMetrics(rootUrl, componentName);
                }
                throw new RuntimeException(e);
            }

            SonarResults sonarResultsTemp = objectMapper.readValue(json, SonarResults.class);

            // Update SonarResults
            sonarResults.setPaging(sonarResultsTemp.getPaging());
            sonarResults.getComponents().addAll(sonarResultsTemp.getComponents());

            page++;
        } while (sonarResults.getPaging().getTotal() > (sonarResults.getPaging().getPageIndex() * sonarResults.getPaging().getPageSize()));

        return sonarResults;
    }

    /**
     * Format correctly the response form Sonar
     */
    public List<Node> formatResults(SonarResults sonarResults) {
        List<Node> nodes = new ArrayList<>();

        for (SonarResults.Component component : sonarResults.getComponents()) {

            Node node = new Node();
            node.setName(component.getPath());
            node.setMetrics(new ArrayList<>());

            for (SonarResults.Metric metric : component.getMeasures()) {
                node.getMetrics().add(new Metric(metric.getMetric(), metric.getValue()));
            }

            nodes.add(node);
        }
        return nodes;
    }

    /**
     * In case of error we will display the available metrics
     */
    public void displayAvailableMetrics(String rootUrl, String projectName) {

        String url = rootUrl + "api/metrics/search?&component=" + projectName;

        try {
            String json = httpRequest.get(url);
            SonarMetricAvailable sonarMetricAvailable = objectMapper.readValue(json, SonarMetricAvailable.class);

            System.err.println("\n >>> Project Name: " + projectName + " (source = SonarCloud)");
            sonarMetricAvailable.formatPrint();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
