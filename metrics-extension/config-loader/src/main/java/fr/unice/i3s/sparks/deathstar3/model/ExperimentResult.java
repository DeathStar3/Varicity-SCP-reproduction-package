package fr.unice.i3s.sparks.deathstar3.model;

import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.result.SymfinderResult;

import java.util.List;
import java.util.Map;


public record ExperimentResult(String projectName, SymfinderResult symfinderResult,
                               Map<String, List<Node>> externalMetric) {


}
