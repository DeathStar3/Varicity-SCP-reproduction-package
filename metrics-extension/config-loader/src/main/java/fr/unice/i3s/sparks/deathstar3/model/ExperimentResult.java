package fr.unice.i3s.sparks.deathstar3.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.unice.i3s.sparks.deathstar3.serializer.model.Node;
import fr.unice.i3s.sparks.deathstar3.symfinder.engine.result.SymfinderResult;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;
import java.util.Objects;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public final class ExperimentResult {
    private String projectName;
    private SymfinderResult symfinderResult;
    private Map<String, List<Node>> externalMetric;


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
}
