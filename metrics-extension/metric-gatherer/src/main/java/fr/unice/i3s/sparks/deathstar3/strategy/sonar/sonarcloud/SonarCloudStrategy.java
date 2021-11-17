package fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarcloud;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Metric;
import fr.unice.i3s.sparks.deathstar3.strategy.MetricGatheringStrategy;
import fr.unice.i3s.sparks.deathstar3.strategy.sonar.model.SonarResults;
import fr.unice.i3s.sparks.deathstar3.utils.HttpRequest;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class SonarCloudStrategy implements MetricGatheringStrategy {

    private final ObjectMapper objectMapper = new ObjectMapper(new YAMLFactory());
    private final HttpRequest httpRequest = new HttpRequest();

    @Override
    public List<Node> getMetrics(String sourceUrl, List<String> metricNames) throws IOException {

        SonarResults sonarResults = performHttpRequest(sourceUrl, metricNames);
        return formatResults(sonarResults);
    }

    public SonarResults performHttpRequest(String sourceUrl, List<String> metricNames) throws IOException {

        int numElementsPerPage = 500;
        String baseUrl = sourceUrl + "&metricKeys=" + String.join(",", metricNames) + "&ps=" + numElementsPerPage; //TODO Manage API errors when the metric asked is not find by sonar

        SonarResults sonarResults = new SonarResults();
        sonarResults.setComponents(new ArrayList<>());

        int page = 1;
        do {
            //Make the http request to Sonar Cloud
            String json = httpRequest.get(baseUrl + "&p=" + page);
            SonarResults sonarResultsTemp = objectMapper.readValue(json, SonarResults.class);

            //Update SonarResults
            sonarResults.setPaging(sonarResultsTemp.getPaging());
            sonarResults.getComponents().addAll(sonarResultsTemp.getComponents());

            page++;
        } while (sonarResults.getPaging().getTotal() > (sonarResults.getPaging().getPageIndex() * sonarResults.getPaging().getPageSize()));

        return sonarResults;
    }

    public List<Node> formatResults(SonarResults sonarResults) {
        List<Node> nodes = new ArrayList<>();

        for (SonarResults.Component component : sonarResults.getComponents()) {

            Node node = new Node();
            node.setName(((component.getPath().replaceAll("^src/main/java/", "")).replaceAll("\\.java$","")).replaceAll("/", ".")); //TODO need to change the format
            node.setMetrics(new ArrayList<>());

            for (SonarResults.Metric metric: component.getMeasures()) {
                node.getMetrics().add(new Metric(metric.getMetric(), metric.getValue()));
            }

            nodes.add(node);
        }
        return nodes;
    }
}
