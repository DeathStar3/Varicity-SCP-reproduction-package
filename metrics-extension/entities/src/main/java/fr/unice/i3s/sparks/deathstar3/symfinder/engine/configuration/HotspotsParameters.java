package fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration;

import java.util.Objects;

public final class HotspotsParameters {
    private final int nbVariantsThreshold;
    private final int nbAggregationsThreshold;

    public HotspotsParameters(int nbVariantsThreshold, int nbAggregationsThreshold) {
        this.nbVariantsThreshold = nbVariantsThreshold;
        this.nbAggregationsThreshold = nbAggregationsThreshold;
    }

    public int nbVariantsThreshold() {
        return nbVariantsThreshold;
    }

    public int nbAggregationsThreshold() {
        return nbAggregationsThreshold;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (HotspotsParameters) obj;
        return this.nbVariantsThreshold == that.nbVariantsThreshold &&
                this.nbAggregationsThreshold == that.nbAggregationsThreshold;
    }

    @Override
    public int hashCode() {
        return Objects.hash(nbVariantsThreshold, nbAggregationsThreshold);
    }

    @Override
    public String toString() {
        return "HotspotsParameters[" +
                "nbVariantsThreshold=" + nbVariantsThreshold + ", " +
                "nbAggregationsThreshold=" + nbAggregationsThreshold + ']';
    }


}
