package fr.unice.i3s.sparks.deathstar3.model;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MetricSource {
    private String name; // Mandatory
    private boolean enabled = true; // Optional (default to true)
    private String componentName; // Mandatory
    private String rootUrl; // Mandatory
    private List<String> metrics;

    /**
     *
     * @return a deep exact copy of this instance
     */
    public MetricSource cloneSelfExact(){
        return new MetricSource(name,enabled,componentName,rootUrl,new ArrayList<>(metrics));
    }
}
