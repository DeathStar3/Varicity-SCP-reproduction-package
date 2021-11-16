package fr.unice.i3s.sparks.deathstar3.strategy.sonar.sonarqube;

import fr.unice.i3s.sparks.deathstar3.model.Node;
import fr.unice.i3s.sparks.deathstar3.strategy.MetricGatheringStrategy;

import java.util.List;

public class SonarQubeStrategy implements MetricGatheringStrategy {

    @Override
    public List<Node> getMetrics(String sourceUrl, List<String> metricNames) {
        return null;
    }
}
