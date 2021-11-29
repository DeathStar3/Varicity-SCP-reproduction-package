# Metrics Extensions

## How to use the project

1. Download docker images

```
docker pull sonarqube:9.1.0-community
docker pull sonarsource/sonar-scanner-cli
```

2. Create and run custom sonarqube image

```sh
bash build.sh

docker run --name sonarqubehost -p 9000:9000 --network varicity-config --expose=9000 varicity-sonarqube 

```
3. Go in the CompilerTest class
Add a new `ProjectConfig` variable and provide information of that project following existing examples.
Add a sonar-project.properties at the root of your project (the directory containing the pom.xml/gradle/src/target ...)
and fill it with the content below (adapted for your experiment)
```properties
# must be unique in a given SonarQube instance
sonar.projectKey=jfreechart

# this is the name and version displayed in the SonarQube UI. Mandatory prior to SonarQube 6.1.
sonar.projectName=jfreechart

# path to source directories (required)
sonar.projectVersion=1.0

# path to project binaries (optional), for example directory of Java bytecode
#binaries=binDir

# Path is relative to the sonar-project.properties file. Replace "\" by "/" on Windows.
# Since SonarQube 4.2, this property is optional if sonar.modules is set. 
# If not set, SonarQube starts looking for source code from the directory containing 
# the sonar-project.properties file.
#sonar.sources=src
#sonar.binaries=target
sonar.java.binaries=target
#sonar.exclusions=target
# Encoding of the source code. Default is default system encoding
sonar.sourceEncoding=UTF-8

# List of the module identifiers
#sonar.modules=.

# Language
sonar.language=java

# Uncomment those lines if some features of java 5 or java 6 like annotations, enum, ...
 # are used in the source code to be analysed
#sonar.java.source=1.8
#sonar.java.target=1.8
#sonar.coverage.jacoco.xmlReportPaths
#sonar.java.libraries
```
Run the `executeTest()` after replacing the variable jfreechart by your ProjectConfig variable. 
5. 
Use `docker container ls -a` to find out the name of the compilation and scanner containers and use
`docker container logs -f <CONTAINER_NAME>` to follow the compilation and scanning step and check
