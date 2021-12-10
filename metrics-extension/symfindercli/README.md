# Symfinder-CLI

It is the command line implementation of MetricsExtension. It allow you to use Symfinder + retrieve metrics on the projects from your terminal.

### Building symfinder
At the root of the repository execute `build-docker-image.(sh|bat)` depending on your OS.

## Using symfinder on your project

To use Symfinder CLI you need two mandatories arguments. A path to the hotspots configuration and a path to the experiments file.
### symfinder configuration

The application's settings are set up using a YAML file
Here is an example:

```yaml
hotspots:
  nbAggregationsThreshold: 5
  nbVariantsThreshold: 20
```

#### Experiments

```yaml
junit:
  repositoryUrl: https://github.com/junit-team/junit4
  sourcePackage: .
  tagIds:
    - r4.12
javaGeom:
  repositoryUrl: https://github.com/dlegland/javaGeom
  sourcePackage: src
  commitIds:
    - 7e5ee60ea9febe2acbadb75557d9659d7fafdd28

junit-r4.13.2:
  repositoryUrl: "https://github.com/DeathStar3-projects/junit-test-project.git"
  buildEnv: "maven"
  buildEnvTag: "3.8.3-openjdk-17"
  sourcePackage: src
  sonarqubeNeeded: true
  commitIds:
    - fc5898cf163674c6ef381f5d018fd96e2d516cc4
  skipClone: false
  buildCmdIncludeSonar: true
  buildCmd: "mvn clean package -Pcoverage sonar:sonar -f /project/pom.xml -Dsonar.scm.disabled=true"
  sources:
    - name: "sonarqube"
      enabled: true
      rootUrl: "http://localhost:9000"
      componentName: "junit-r4.13.2"
      metrics:
        - "coverage"
        - "complexity"
        - "cognitive_complexity"
```
| Attribute         | Type    | Description |
|--------------|-----------|------------|
| path | string      | If the project is already on the disk, it should be the path of project eg: **/home/username/myProjects/thisProject** , if is not on the disk and must be cloned then the path provided must be the path of the parent directory where the project must be cloned, eg: /home/username/myProjects. If it is not provided then a temporay directory is used      |
|  outputPath     |  string | It is where the programm will put the results of the run of Symfinder and/or MetricsExtension       |
| repositoryUrl | string | The git url of the project, it can end or not with .git The repository must be public|
| skipClone | boolean | Whether to clone the project or not, default is `false`. If it is true then `repositoryUrl` is not considered, and `path` must be the path leading to the project eg : **/home/username/myProjects/thisProject**|
| skipSymfinder | boolean | default is `false`, whether to use the Symfinder Engine to analyse variability or not|
| buildCmdIncludeSonar | boolean | default is `false`, if the project is in JDK 11 or above, and the `buildCmd` command already include to use sonar then it can be set to `true`. This means that the compilation of the project and it analysis are done in one step by the build tools eg: `mvn clean install sonar:sonar -f /project/pom.xml`,|
| sonarqubeNeeded |boolean  | whether to start SonarQube or not for the project, default is `false`. If you want to get the quality metrics and don't have an external source like Sonarcloud  for the metrics then it must be set to true|
| buildEnv | string | a docker image that contains the runtime necessary to build your project, if the image is not on your computer it will be downloaded|
| buildEnvTag | string | the tag of the image of your build environment, not optional if you provided a buildEnv and you want a local analysis|
| buildCmd | string | a single command to compile the project before a sonar scan. Your project is mounted under the volume `/project` inside the docker container of your `buildEnv` so you must take that into account when writing your command. Search on [Docker Hub](https://hub.docker.com/) to find an appropriate image or build it yourself from a base image and add your requirements. Your docker image must be compatible with the development/production environment you the project you want to analyse|
| tagIds | string[] | list of tags that will be cloned, see also `tagIds`
| commitIds | string [] | IDs of the commits to analyse, in the current version of the extension all the commits and tags will be cloned and checked-out but only one of the commits/tags will be analyse by Symfinder and MetricsExtension|
| sourcePackage | string | relative path of the package containing the sources of the project to analyse. `.` corresponds to the root of the project to be analysed,used by Symfinder|
| sources | MetricSource[] | See MetricSource section |

- MetricSource

| Attribute         | Type    | Description |
|--------------|-----------|------------|
| name | string | Name of the source, two possible values `sonarcloud` if your source is remote like [Sonarcloud](https://sonarcloud.io/) or [SonarQube Inria](https://sonarqube.inria.fr/sonarqube/about). If you want to use a sonarqube started by the program use `sonarqube`, You can put multiple remote sources in addition to the local one|
| enabled | boolean | Optional : enable the source (default=true)|
| rootUrl | string | Mandatory: Url to gather the metrics|
| componentName | string | usually correspond also to the project name|
| metrics | string[] | list of metrics you want to collect see [link](#) for a list of available metrics and their meaning|


For each experiment, you can mix different commits and different tags to checkout. For example, we could have :

```yaml
junit:
  repositoryUrl: https://github.com/junit-team/junit4
  sourcePackage: .
  tagIds:
    - r4.12
    - r4.11
  commitIds:
    - c3715204786394f461d94953de9a66a4cec684e9
```
### Running Symfinder
```shell
./run-docker-cli.sh -i <experiment-configuration> -s <hotspot-configuration> -verbosity <LOG_LEVEL> -http <url>
```

| Options/Arguments         | Type    | Description |
|--------------|-----------|------------|
|-i | string | the absolute or relative path of the file containing your configuration for your experiment See [Documentation](Wiki.md) for the format of the file|
| -s | string | the absolute or relative path of the file containing your hotspot configuration. See [Documentation](Wiki.md) for the format of the file.|
| LOG_LEVEL | string | the verbosity of the program possible values are `"OFF", "FINEST", "FINER", "FINE", "CONFIG", "INFO", "WARNING", "SEVERE", "ALL"`.|
| -http | string | An url where you want the result of the analysis to be posted using `HTTP/POST`. Eg `http://localhost:3000/projects`. Nothing will be written on disk if you use that option|

Create a  directory `data` as a subdirectory of where you will be running the command. Then put your experimentations file and the hotspots configurations
The script mount that directory to the docker container under `/data`.
So for the path of the files you need to take that into account.
You also need to take that into account for the `path` and `outputPath` in the experiments config.
If you are using the option `-http`, then you can't use `localhost` your url must be accessible through the internet or must be
a docker container in the same network as symfinder-cli. If you follow the general instructions in the Readme at the root of the project then it will be `http://varicityback:3000/projects`.

## Technical Requirements
- Docker : Instructions to install Docker are available [here](https://docs.docker.com/get-docker/).
  **Note:** You need to have a system running on either
- GNU/Linux
- Windows 10 64bit: Pro, Enterprise or Education (Build 15063 or later)
- macOS Sierra 10.12 or newer on a hardware from at least 2010

**Note:** If you run symfinder on a Windows system, symfinder must be placed somewhere on your `C:` drive.

If your system does not match any of the requirements above, you must install a virtual machine.
[This tutorial](https://www.wikihow.com/Install-Ubuntu-on-VirtualBox) may help you.

**Note:** By default, on a GNU/Linux host, Docker commands must be run using `sudo`. Two options are available for you in order to run symfinder:
- Follow [these short steps](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user) to allow your user to call Docker commands,
- Prefix the scripts calls with `sudo`.


