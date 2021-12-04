package fr.unice.i3s.sparks.deathstar3.strategy;

import java.util.List;
import java.util.stream.Collectors;

import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MetricGathering {

    private MetricGatheringStrategy strategy;

    public MetricGathering(MetricGatheringStrategy strategy) {
        this.strategy = strategy;
    }

    /**
     * Gather the metrics for a given source and save them in a Json file
     */
    public List<Node> gatherAndSaveMetrics(String sourceUrl, String componentName, List<String> metrics) {

        try {
            List<Node> nodes = strategy.getMetrics(sourceUrl, componentName, metrics);
            log.debug("Metrics gathered: " + nodes.stream().limit(500).collect(Collectors.toList()));
            return nodes;
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.warn("Returning an empty list");
        return List.of();
    }
}
