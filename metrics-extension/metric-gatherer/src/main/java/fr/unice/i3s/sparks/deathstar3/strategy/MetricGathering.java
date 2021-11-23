package fr.unice.i3s.sparks.deathstar3.strategy;

import fr.unice.i3s.sparks.deathstar3.serializer.JsonSerializer;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class MetricGathering {

    private MetricGatheringStrategy strategy;

    public MetricGathering(MetricGatheringStrategy strategy) {
        this.strategy = strategy;
    }

    /**
     * Gather the metrics for a given source and save them in a Json file
     */
    public void gatherAndSaveMetrics(String sourceUrl, String componentName, List<String> metrics, String outputPath) {

        try {
            List<Node> nodes = strategy.getMetrics(sourceUrl, componentName, metrics);
            log.debug("Metrics gathered: " + nodes.stream().limit(500).collect(Collectors.toList()));

            JsonSerializer serializer = new JsonSerializer();
            serializer.generateAndSaveJson(nodes, outputPath + "-" + new Date().getTime() + ".json");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
