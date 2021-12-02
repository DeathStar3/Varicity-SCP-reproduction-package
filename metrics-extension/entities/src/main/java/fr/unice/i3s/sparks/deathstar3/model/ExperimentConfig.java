package fr.unice.i3s.sparks.deathstar3.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ExperimentConfig {

    @NotBlank()
    private String projectName;
    private String repositoryUrl;
    /**
     * If skip clone is true then the attributes repositoryUrl, tagIds are ignored
     * and the path must be the path to the project
     * eg: /home/user/projects/thisProject
     * If skipClone is false the path attribute must be the parent directory where
     * we want to clone the project
     * eg: /home/user/projects
     */
    private boolean skipClone = false;
    private boolean skipSymfinder = false;
    private String path = "resources";
    /**
     * The directory containing the classes to be analyzed by Symfinder
     */
    private String sourcePackage;

    private List<String> tagIds;
    private List<String> commitIds;
    private String buildEnv;
    private String buildEnvTag;
    private String buildCmd;
    /**
     * whether the build command contains a sonar; eg: mvn clean package
     * sonar:sonar
     */
    private boolean buildCmdIncludeSonar;
    private boolean sonarqubeNeeded = false;
    private String outputPath = "generated_visualizations/data/externals"; // Optional

    private String sourceCodePath = "sources"; // Optional
    private List<MetricSource> sources;

    public ExperimentConfig(String projectName, String path, String buildEnv, String buildEnvTag,
                            String buildCmd, boolean buildCmdIncludeSonar) {
        this.projectName = projectName;
        this.path = path;
        this.buildEnv = buildEnv;
        this.buildEnvTag = buildEnvTag;
        this.buildCmd = buildCmd;
        this.buildCmdIncludeSonar = buildCmdIncludeSonar;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this)
            return true;
        if (obj == null || obj.getClass() != this.getClass())
            return false;
        ExperimentConfig that = (ExperimentConfig) obj;
        return Objects.equals(this.projectName, that.projectName)
                && Objects.equals(this.repositoryUrl, that.repositoryUrl)
                && Objects.equals(this.sourcePackage, that.sourcePackage) && Objects.equals(this.tagIds, that.tagIds);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectName, repositoryUrl, sourcePackage, tagIds);
    }

}
