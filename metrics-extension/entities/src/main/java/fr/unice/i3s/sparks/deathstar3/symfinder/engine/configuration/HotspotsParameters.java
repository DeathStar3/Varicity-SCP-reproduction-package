package fr.unice.i3s.sparks.deathstar3.symfinder.engine.configuration;

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
public final class HotspotsParameters {
    private  int nbVariantsThreshold;
    private int nbAggregationsThreshold;

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

}
