package fr.unice.i3s.sparks.deathstar3.model;

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

    private String name; // Mandatory
    private boolean enabled = true; // Optional (default to true)

    private String shellLocation; // Optional (default cmd or sh)
    private String workingDirectory = System.getProperty("user.home"); // Optional (default user home directory)
    private List<String> commands; // Optional

    private String componentName; // Mandatory
    private String rootUrl; // Mandatory

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
