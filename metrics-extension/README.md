# Metrics-extension

Metrics-Extension is a modular Java project that extends Symfinder to allow you to retrieve metrics from Sonarqube and SonarCloud 
from a project you are analyzing. One of its module is `symfindercli`. It is the module that contain the `main` method.


## Technical Requirements
For development:
- Maven
- JDK 11
For building:
- Docker
## Using Metrics-extension
If you are interested in using the fonctionnalities of Metrics Extension in your own project, then install it in your
local Maven repository with
```shell
mvn clean install -DskipTests=true
```
Then add it as a dependency in your project
### If you use Gradle
```groovy
repositories {
    mavenCentral()
    mavenLocal()
}

implementation('fr.unice.i3s.sparks.deathstar3:config-loader:1.0-SNAPSHOT'){

}
```
### If you use Maven
```xml
<dependency>
    <groupId>fr.unice.i3s.sparks.deathstar3</groupId>
    <artifactId>config-loader</artifactId>
    <version>1.0-SNAPSHOT</version>
    <scope>compile</scope>
</dependency>
```
### Metrics-extension configuration
You can use environment variables to control the behavior of Symfinder. Most environment variables
have a default value that is appropriate for most use cases. One of the most important environment variables is
`RUNTIME_MODE`. It allows you to define whether or not you are running Symfinder in docker or on the host. By default it is assumed to be running directly on the host.