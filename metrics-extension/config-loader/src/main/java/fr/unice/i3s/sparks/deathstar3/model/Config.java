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
public class Config {

    private String projectName = "default"; //Optional
    private String outputPath = "output"; //Optional
    private String sourceCodePath = "sources"; //Optional

    private List<Source> sources;

    @Override
    public String toString() {
        return "Config{" +
                "projectName='" + projectName + '\'' +
                ", outputPath='" + outputPath + '\'' +
                ", sourceCodePath='" + sourceCodePath + '\'' +
                ", sources=" + sources +
                '}';
    }
}
