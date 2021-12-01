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
@JsonIgnoreProperties(ignoreUnknown = true)
public class MetricSource {

    @JsonProperty("name")
    private String name; // Mandatory
    @JsonProperty("enabled")
    private boolean enabled = true; // Optional (default to true)


    private String shellLocation; // Optional (default powershell or sh)
    private String workingDirectory = System.getProperty("user.home"); // Optional (default user home directory)
    @JsonProperty("commands")
    private List<String> commands; // Optional


    private String componentName; // Mandatory
    @JsonProperty("rootUrl")
    private String rootUrl; // Mandatory

    @JsonProperty("metrics")
    private List<String> metrics;


}
