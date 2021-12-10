package fr.unice.i3s.sparks.deathstar3.model;

import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.result.SymfinderResult;

import java.util.List;
import java.util.Map;
import java.util.Objects;


public final class ExperimentResult {
    private final String projectName;
    private final SymfinderResult symfinderResult;
    private final Map<String, List<Node>> externalMetric;

    public ExperimentResult(String projectName, SymfinderResult symfinderResult,
                            Map<String, List<Node>> externalMetric) {
        this.projectName = projectName;
        this.symfinderResult = symfinderResult;
        this.externalMetric = externalMetric;
    }

    public String projectName() {
        return projectName;
    }

    public SymfinderResult symfinderResult() {
        return symfinderResult;
    }

    public Map<String, List<Node>> externalMetric() {
        return externalMetric;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (ExperimentResult) obj;
        return Objects.equals(this.projectName, that.projectName) &&
                Objects.equals(this.symfinderResult, that.symfinderResult) &&
                Objects.equals(this.externalMetric, that.externalMetric);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectName, symfinderResult, externalMetric);
    }

    @Override
    public String toString() {
        return "ExperimentResult[" +
                "projectName=" + projectName + ", " +
                "symfinderResult=" + symfinderResult + ", " +
                "externalMetric=" + externalMetric + ']';
    }


}
