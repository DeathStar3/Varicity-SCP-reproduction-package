package fr.unice.i3s.sparks.deathstar3.model;

import java.util.List;
import java.util.Set;
import java.util.Objects;

import javax.validation.constraints.NotBlank;

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
public class ExperimentConfig {

    @NotBlank()
    private String projectName;//
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
    private String path;
    /**
     * The directory containing the classes to be analyzed by Symfinder
     */
    private String sourcePackage;

    private Set<String> tagIds;//
    private Set<String> commitIds;//
    private String buildEnv;
    private String buildEnvTag;
    private String buildCmd;
    /**
     * whether the build command contains a sonar; eg: mvn clean package
     * sonar:sonar
     */
    private boolean buildCmdIncludeSonar;
    private boolean sonarqubeNeeded = false;
    private String outputPath; // Optional

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

    /**
     * Deep copy of the instance but with omission of some fields
     * @return a copy of the instance but with some differences
     */
    public ExperimentConfig cloneSelf(){
        ExperimentConfig other= new ExperimentConfig();

        other.setPath(this.getPath());
        other.setCommitIds(Set.of());
        other.setTagIds(Set.of());
        other.setRepositoryUrl(this.repositoryUrl);
        other.setOutputPath(this.outputPath);
        other.setProjectName("");
        other.setBuildCmd(this.buildCmd);
        other.setBuildCmdIncludeSonar(this.buildCmdIncludeSonar);
        other.setBuildEnv(this.buildEnv);
        other.setBuildEnvTag(this.buildEnvTag);
        other.setSkipClone(this.skipClone);
        if(this.sources != null){
            other.setSources(  this.sources.stream().map(MetricSource::cloneSelfExact).toList() );
        }

        other.setSourcePackage(this.sourcePackage);
        other.setSkipSymfinder(this.skipSymfinder);
        other.setSonarqubeNeeded(this.sonarqubeNeeded);

        return other;
    }

    public void changeComponentNameOfLocalMetricSource(String newName){
        if(this.sources==null || this.sources.isEmpty()){
            return;
        }
        for(MetricSource source:sources){
            if(source.getName().equals("sonarqube")){
                source.setComponentName(newName);
            }
        }
    }

}
