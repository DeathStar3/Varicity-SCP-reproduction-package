/*
 * This file is part of symfinder.
 *
 *  symfinder is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  symfinder is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with symfinder. If not, see <http://www.gnu.org/licenses/>.
 *
 *  Copyright 2018-2021 Johann Mortara <johann.mortara@univ-cotedazur.fr>
 *  Copyright 2018-2021 Xhevahire Tërnava <t.xheva@gmail.com>
 *  Copyright 2018-2021 Philippe Collet <philippe.collet@univ-cotedazur.fr>
 */

package fr.unice.i3s.sparks.deathstar3.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExperimentConfig {

    @NotBlank()
    private String projectName;//
    private String repositoryUrl;
    private String path;
    private String buildEnv;
    private String buildEnvTag;
    private String buildCmd;
    private String outputPath; // Optional
    /**
     * The directory containing the classes to be analyzed by Symfinder
     */
    private String sourcePackage;
    private String traces;
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
    /**
     * whether the build command contains a sonar; eg: mvn clean package
     * sonar:sonar
     */
    private boolean buildCmdIncludeSonar;
    private boolean sonarqubeNeeded = false;

    private Set<String> tagIds;//
    private Set<String> commitIds;//

    private List<String> filters;
    private List<String> apiFilters;

    private List<MetricSource> sources;

    private int compositionLevel;
    private String compositionType;

    public ExperimentConfig(String projectName, String path, String buildEnv, String buildEnvTag,
                            String buildCmd, boolean buildCmdIncludeSonar) {
        this.projectName = projectName;
        this.path = path;
        this.buildEnv = buildEnv;
        this.buildEnvTag = buildEnvTag;
        this.buildCmd = buildCmd;
        this.buildCmdIncludeSonar = buildCmdIncludeSonar;
    }

    /**
     * @return an exact deep copy of this object, null if the deep copy failed
     */
    public ExperimentConfig cloneSelfExact() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper
                    .readValue(objectMapper.writeValueAsString(this), ExperimentConfig.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Deep copy of the instance but with omission of some fields
     *
     * @return a copy of the instance but with some differences
     */
    public ExperimentConfig cloneSelf() {
        ExperimentConfig other = new ExperimentConfig();

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
        if (this.sources != null) {
            other.setSources(this.sources.stream().map(MetricSource::cloneSelfExact).collect(Collectors.toList()));
        }

        other.setSourcePackage(this.sourcePackage);
        other.setSkipSymfinder(this.skipSymfinder);
        other.setSonarqubeNeeded(this.sonarqubeNeeded);

        return other;
    }

    public void changeComponentNameOfLocalMetricSource(String newName) {
        if (this.sources == null || this.sources.isEmpty()) {
            return;
        }
        for (MetricSource source : sources) {
            if (source.getName().equals("sonarqube")) {
                source.setComponentName(newName);
            }
        }
    }

}
