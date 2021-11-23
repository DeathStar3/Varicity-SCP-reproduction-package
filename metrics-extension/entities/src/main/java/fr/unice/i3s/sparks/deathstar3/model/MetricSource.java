package fr.unice.i3s.sparks.deathstar3.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MetricSource {

    @JsonProperty("name")
    private String name; // Mandatory
    @JsonProperty("enabled")
    private boolean enabled = true; // Optional (default to true)

    @JsonProperty("shell-location")
    private String shellLocation; // Optional (default powershell or sh)
    @JsonProperty("working-directory")
    private String workingDirectory = System.getProperty("user.home"); // Optional (default user home directory)
    @JsonProperty("commands")
    private List<String> commands; // Optional

    @JsonProperty("component-name")
    private String componentName; // Mandatory
    @JsonProperty("root-url")
    private String rootUrl; // Mandatory

    @JsonProperty("metrics")
    private List<String> metrics;

    @Override
    public String toString() {
        return "MetricSource{" +
                "name='" + name + '\'' +
                ", enabled=" + enabled +
                ", shellLocation='" + shellLocation + '\'' +
                ", workingDirectory='" + workingDirectory + '\'' +
                ", commands=" + commands +
                ", componentName='" + componentName + '\'' +
                ", rootUrl='" + rootUrl + '\'' +
                ", metrics=" + metrics +
                '}';
    }
}
