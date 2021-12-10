package fr.unice.i3s.sparks.deathstar3.symfinder.engine.result;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public final class SymfinderResult {
    private String vpJsonGraph;
    private String statisticJson;

    public String vpJsonGraph() {
        return vpJsonGraph;
    }

    public String statisticJson() {
        return statisticJson;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (SymfinderResult) obj;
        return Objects.equals(this.vpJsonGraph, that.vpJsonGraph) &&
                Objects.equals(this.statisticJson, that.statisticJson);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vpJsonGraph, statisticJson);
    }
}
