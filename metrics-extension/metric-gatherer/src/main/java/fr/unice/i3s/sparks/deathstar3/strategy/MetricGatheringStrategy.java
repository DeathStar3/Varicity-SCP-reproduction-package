package fr.unice.i3s.sparks.deathstar3.strategy;

import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;

import java.io.IOException;
import java.util.List;

public interface MetricGatheringStrategy {

    List<Node> getMetrics(String sourceUrl, List<String> metricNames) throws IOException;

}
