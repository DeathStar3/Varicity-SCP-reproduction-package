package fr.unice.i3s.sparks.deathstar3.symfinder.engine.result;

import java.util.Objects;

public final class SymfinderResult {
    private final String vpJsonGraph;
    private final String statisticJson;

    public SymfinderResult(String vpJsonGraph, String statisticJson) {
        this.vpJsonGraph = vpJsonGraph;
        this.statisticJson = statisticJson;
    }

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

    @Override
    public String toString() {
        return "SymfinderResult[" +
                "vpJsonGraph=" + vpJsonGraph + ", " +
                "statisticJson=" + statisticJson + ']';
    }


}
