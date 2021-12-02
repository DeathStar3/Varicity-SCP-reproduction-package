package fr.unice.i3s.sparks.deathstar3.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MetricSource {
    private String name; // Mandatory
    private boolean enabled = true; // Optional (default to true)
    private String shellLocation; // Optional (default powershell or sh)
    private String workingDirectory = System.getProperty("user.home"); // Optional (default user home directory)
    private List<String> commands; // Optional
    private String componentName; // Mandatory
    private String rootUrl; // Mandatory
    private List<String> metrics;
}
