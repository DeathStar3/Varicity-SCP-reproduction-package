# Config Loader

If you are interested in using the fonctionnalities of Symfinder in your own project as a dependency, then install it in your
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