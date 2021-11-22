package fr.unice.i3s.sparks.deathstar3.strategy;

import fr.unice.i3s.sparks.deathstar3.serializer.JsonSerializer;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.List;

@Slf4j
public class MetricGathering {

    private MetricGatheringStrategy strategy;

    public MetricGathering(MetricGatheringStrategy strategy) {
        this.strategy = strategy;
    }

    /**
     * Gather the metrics for a given source and save them in a Json file
     */
    public void gatherAndSaveMetrics(String sourceUrl, String sourceProjectName, List<String> metrics, String outputFileName) {

        try {
            List<Node> nodes = strategy.getMetrics(sourceUrl, sourceProjectName, metrics);
            log.info("Metrics gathered: " + nodes);

            JsonSerializer serializer = new JsonSerializer();
            serializer.generateAndSaveJson(nodes, outputFileName + "-" + new Date().getTime() + ".json");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
