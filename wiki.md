
To run a project with Varicity you need to prepare an experiment configuration file. 
## Configuration file structure:

```yaml
junit-r4.12:                                                      # Mandatory: Project name, multiple projects can be declared
  path: "C:\\User\\{UserName}\\Document\\projectName" # Optional : Source code directory
  outputPath: ".\\metrics-external\\output"                      # Optional : Metrics json file output location (default=generated_visualizations/data/externals)
  sources:                                                        # Mandatory: List of metric sources
    - name: "sonarqube"                                           # Mandatory: Source name
      enabled: true                                               # Optional : enable 
      # --- --- API CONFIG --- --- #
      rootUrl: "http://localhost:9000"                           # Mandatory: Url to gather the metrics
      componentName: "junit%3Ajunit"                             # Mandatory: Component name (project name)
      metrics:                                                    # Mandatory: List of metrics to gather
        - "coverage"
        - "complexity"
        - "cognitive_complexity"
```


## Experiment configuration documentation
| Attribute         | Type    | Description |
|--------------|-----------|------------|
| path | string      | If the project is already on the disk, it should be the path of project eg: **/home/username/myProjects/thisProject** , if is not on the disk and must be cloned then the path provided must be the path of the parent directory where the project must be cloned, eg: /home/username/myProjects. If it is not provided then a temporay directory is used      |
|  outputPath     |  string | It is where the programm will put the results of the run of Symfinder and/or MetricsExtension       |
| repositoryUrl | string | The git url of the project, it can end or not with .git The repository must be public
| skipClone | boolean | Whether to clone the project or not, default is `false`. If it is true then `repositoryUrl` is not considered, and `path` must be the path leading to the project eg : **/home/username/myProjects/thisProject**
| skipSymfinder | boolean | default is `false`, whether to use the Symfinder Engine to analyse variability or not
| buildCmdIncludeSonar | boolean | default is `false`, if the project is in JDK 11 or above, and the `buildCmd` command already include to use sonar then it can be set to `true`. This means that the compilation of the project and it analysis are done in one step by the build tools eg: `mvn clean install sonar:sonar -f /project/pom.xml`, 
| sonarqubeNeeded |boolean  | whether to start SonarQube or not for the project, default is `false`. If you want to get the quality metrics and don't have an external source like Sonarcloud  for the metrics then it must be set to true
| buildEnv | string | a docker image that contains the runtime necessary to build your project, if the image is not on your computer it will be downloaded 
| buildEnvTag | string | the tag of the image of your build environment, not optional if you provided a buildEnv and you want a local analysis
| buildCmd | string | a single command to compile the project before a sonar scan. Your project is mounted under the volume `/project` inside the docker container of your `buildEnv` so you must take that into account when writing your command. Search on [Docker Hub](https://hub.docker.com/) to find an appropriate image or build it yourself from a base image and add your requirements. Your docker image must be compatible with the development/production environment you the project you want to analyse
| tagIds | string[] | list of tags that will be cloned, see also `tagIds`
| commitIds | string [] | IDs of the commits to analyse, in the current version of the extension all the commits and tags will be cloned and checked-out but only one of the commits/tags will be analyse by Symfinder and MetricsExtension
| sourcePackage | string | relative path of the package containing the sources of the project to analyse. `.` corresponds to the root of the project to be analysed,used by Symfinder
| sources | MetricSource[] | See MetricSource section

- MetricSource

| Attribute         | Type    | Description |
|--------------|-----------|------------|
| name | string | Name of the source, two possible values `sonarcloud` if your source is remote like [Sonarcloud](https://sonarcloud.io/) or [SonarQube Inria](https://sonarqube.inria.fr/sonarqube/about). If you want to use a sonarqube started by the program use `sonarqube`, You can put multiple remote sources in addition to the local one
| enabled | boolean | Optional : enable the source (default=true)
| rootUrl | string | Mandatory: Url to gather the metrics
| componentName | string | usually correspond also to the project name 
| metrics | string[] | list of metrics you want to collect see [link](#) for a list of available metrics and their meaning




## Examples of configurations file:

Junit4 
``` yaml
junit-r4.12: #Project name
  repositoryUrl: https://github.com/junit-team/junit4
  sourcePackage: src/main/java/org/junit
  buildEnv: "maven"
  buildEnvTag: "3.6.1-jdk-13-alpine"
  tagIds:
    - r4.12
  sources:
    - name: "sonarqube"
      enabled: true 
      rootUrl: "http://localhost:9000"
      componentName: "junit-r4.12"
      metrics:
        - "coverage"
    - name: "sonarcloud"
      enabled: true
      rootUrl: "https://sonarcloud.io"
      component-name: "pfc-test.sonar%3Ajunit4-4.13.2"
      metrics:
        - "complexity"
        - "cognitive_complexity"
```

Regatta

```yaml
regatta: #Project name
  repositoryUrl: "https://github.com/anagonousourou/pns-si3-qgl-regatta-1920-stormbreakers.git"
  skipSymfinder: false
  skipClone: false
  path: ""
  buildEnv: "maven"
  sourcePackage: "src"
  buildEnvTag: "3.6.1-jdk-13-alpine"
  buildCmd: "mvn clean install sonar:sonar -f /project/pom.xml"
  buildCmdIncludeSonar: true
  sonarqubeNeeded: true # for now this means that a varicity-sonarqube instance will be started (if not already started) and a compilation followed by the scan will be done.
  #This behavior will be changed so that the build can be skipped but the varicity-sonarqube will still be started and the scan performed
  #can be useful if the user has already done the build
  outputPath: ""
  commitIds:
    - 1d4d5fc1aba7b176684365000b26bd15b626cd04
  sources:
    - name: "sonarqube"
      enabled: true
      componentName: "regatta"
      rootUrl: "http://localhost:9000"
      metrics:
        - "complexity"
        - "cognitive_complexity"
        - "coverage"

```

```yaml
jfreechart-v1.5.0:
  sources:
    - name: "sonarcloud"
      enabled: true
      rootUrl: "https://sonarcloud.io"
      component-name: "denislilajFox_jfreechart"
      metrics:
        - "complexity"
        - "cognitive_complexity"
```


VaricityConfig

| Attribute         | Type    | Description |
|--------------|-----------|------------|


