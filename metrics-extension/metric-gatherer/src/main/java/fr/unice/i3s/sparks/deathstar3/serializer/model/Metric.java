package fr.unice.i3s.sparks.deathstar3.serializer.model;

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
public class Metric {

    private String name;
    private double value;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Metric metric = (Metric) o;
        return Double.compare(metric.value, value) == 0 && name.equals(metric.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, value);
    }
}