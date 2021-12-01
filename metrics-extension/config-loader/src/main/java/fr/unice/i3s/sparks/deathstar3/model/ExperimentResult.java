package fr.unice.i3s.sparks.deathstar3.model;

import fr.unice.i3s.sparks.deathstar3.engine.result.SymfinderResult;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;

import java.util.List;
import java.util.Map;


public record ExperimentResult(String projectName, SymfinderResult symfinderResult,
                               Map<String, List<Node>> externalMetric) {


}
