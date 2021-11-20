package fr.unice.i3s.sparks.deathstar3.model;

import lombok.*;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Objects;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Config {

    @NotBlank()
    private  String projectName;

    private  String repositoryUrl;
    private String path;
    private  String sourcePackage;
    private List<String> tagIds;
    private String buildEnv;
    private String buildEnvTag;

    private List<String> buildCmds;
    private boolean buildCmdIncludeSonar;
    private String sonarqubeUrl;
    private String outputPath = "metrics-extension/output"; //Optional
    private String sourceCodePath = "sources"; //Optional
    private List<MetricSource> sources;

    public Config(String projectName,  String path, String sourcePackage,
                                String buildEnv,String buildEnvTag, List<String> buildCmds, String sonarqubeUrl, boolean buildCmdIncludeSonar) {
        this.projectName = projectName;
        this.path = path;
        this.sourcePackage = sourcePackage;
        this.buildEnv = buildEnv;
        this.buildEnvTag = buildEnvTag;


        this.buildCmds = buildCmds;
        this.sonarqubeUrl = sonarqubeUrl;
        this.buildCmdIncludeSonar = buildCmdIncludeSonar;
    }



    @Override
    public boolean equals(Object obj) {
        if (obj == this) return true;
        if (obj == null || obj.getClass() != this.getClass()) return false;
        var that = (Config) obj;
        return Objects.equals(this.projectName, that.projectName) &&
                Objects.equals(this.repositoryUrl, that.repositoryUrl) &&
                Objects.equals(this.sourcePackage, that.sourcePackage) &&
                Objects.equals(this.tagIds, that.tagIds);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectName, repositoryUrl, sourcePackage, tagIds);
    }



}
