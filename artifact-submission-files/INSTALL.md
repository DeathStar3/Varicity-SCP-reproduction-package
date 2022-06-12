# Installation instructions

In this document, we assume that you already have a system with:
- a fully functional Docker and Docker Compose install;
- a web browser (our tests have been made with Google Chrome, Mozilla Firefox, and Safari).

See REQUIREMENTS.md file for more details.

## Running VariMetrics

All the scripts in this section are located and executed from the root of the project.

### Reusing the existing Docker image

VariMetrics is available as a Docker image hosted on the [Docker Hub](https://hub.docker.com/r/deathstar3/varimetrics),
allowing to use it without needing to build it.

Run VariMetrics by running


- On GNU/Linux and macOS

    ```
    ./run-compose.sh
    ```

- On Windows

    ```
    run-compose.bat
    ```

*Note:* Docker automatically downloads the image with the `splc2022` tag if it is not found on the host system.

You can also download it manually with:
```
docker pull deathstar3/varimetrics:splc2022
```

VariMetrics is a NodeJS application written in TypeScript deployed in a webpack environment.
The Docker container exposes the application as a server, which is accessed through your web browser.

### Building VariMetrics

**This step is only needed if you edited VariMetrics's source code.**

You can build VariMetrics's Docker images by running

```
./build_varimetrics.sh
```

Then, change the TAG variable in the `run-compose` script from `splc2022` to `local`:

- On GNU/Linux and MacOS, edit `run-compose.sh`
```
- export TAG=splc2022
+ export TAG=local
```

- On Windows, edit `run-compose.bat`
```
- set TAG=splc2022
+ set TAG=local
```

### Checking that VariMetrics works

- Two Docker containers start:
  - `varicity`: the visualization server;
  - `varicity-backend`: a component exposing an endpoint receiving a symfinder analysis as soon as it is finished.
```
$ ./run-compose.sh
resources directory already exists
data directory already exists
dockervolume directory already exists
[+] Running 2/0
 ⠿ Container varicity-backend  Created                                                                                                                                                                                                  0.0s
 ⠿ Container varicity          Created                                                                                                                                                                                                  0.0s
Attaching to varicity, varicity-backend
varicity          | /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
varicity          | /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
varicity          | /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
varicity          | 10-listen-on-ipv6-by-default.sh: info: IPv6 listen already enabled
varicity          | /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
varicity          | /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
varicity          | /docker-entrypoint.sh: Configuration complete; ready for start up
varicity          | 2022/06/06 14:13:20 [notice] 1#1: using the "epoll" event method
varicity          | 2022/06/06 14:13:20 [notice] 1#1: nginx/1.20.2
varicity          | 2022/06/06 14:13:20 [notice] 1#1: built by gcc 10.3.1 20210424 (Alpine 10.3.1_git20210424) 
varicity          | 2022/06/06 14:13:20 [notice] 1#1: OS: Linux 5.17.9-arch1-1
varicity          | 2022/06/06 14:13:20 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker processes
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 25
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 26
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 27
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 28
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 29
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 30
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 31
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 32
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 33
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 34
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 35
varicity          | 2022/06/06 14:13:20 [notice] 1#1: start worker process 36
varicity-backend  | 
varicity-backend  | > varicity-backjs@0.0.1 start:prod
varicity-backend  | > node dist/main
varicity-backend  | 
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [NestFactory] Starting Nest application...
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +28ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [InstanceLoader] AppModule dependencies initialized +2ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RoutesResolver] ProjectController {/}: +167ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/names, GET} route +2ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/json/:name, GET} route +1ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/:name/metrics/external, GET} route +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/:name/metrics/variability, GET} route +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/:name/metrics, GET} route +1ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects, POST} route +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RoutesResolver] ConfigController {/}: +1ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/configs, POST} route +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/configs/:configFile, POST} route +1ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/configs/names, GET} route +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/:projectName/configs, GET} route +1ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/configs/path, GET} route +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/configs, GET} route +1ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/configs/firstOrDefault, GET} route +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [RouterExplorer] Mapped {/projects/:projectName/configs/filenames-and-names, GET} route +0ms
varicity-backend  | [Nest] 18  - 06/06/2022, 2:13:20 PM     LOG [NestApplication] Nest application successfully started +16ms
```
- Once the `Nest application successfully started` log appears, you can now open your web browser and go to `http://localhost:8000`.
- A page appears, showing the list of the available projects.
  ![project_selection_panel](images/project_selection_panel.png)
- By clicking on the desired project's name, you can then select the configuration you want to visualize while a first visualization is loading, here JFreeChart.
  Please note that the visualization may not be centered when appearing. The rendering time of the visualization increases with the number of buildings to display.
  To limit the loading time when switching between projects, we advise to reduce the value of the usage level to limit the number of buildings to render.

  ![visu_selection_panel](images/visu_selection_panel.png)
- By selecting the `VariMetrics view` configuration, we obtain the following view:
  ![jfreechart_visualization](images/jfreechart_visualization.png)

## Running a symfinder analysis

Reproducing the pre-generated visualizations is done by executing their analysis before VariMetrics.
All scripts used in this section are located in the artifact's root directory.

### Reusing the existing Docker images

The following Docker images hosted on the [Docker Hub](https://hub.docker.com/) allow to use symfinder without needing to build it.
```
deathstar3/symfinder-cli
deathstar3/symfinder-neo4j
deathstar3/varimetrics
deathstar3/varimetrics-backend
```

The configuration files for all 7 projects presented in the paper are available in the `/data` directory.
- `azureus.yaml` → [Azureus 5.7.6.0](https://github.com/Corpus-2021/Azureus/tree/5.7.6.0)
- `geotools.yaml` → [GeoTools 23.5](https://github.com/Corpus-2021/geotools/tree/23.5-AnalysisReady)
- `jdk.yaml` → [JDK 17-10](https://github.com/Corpus-2021/jdk/tree/17-10-AnalysisReady)
- `jfreechart-1.5.0.yaml` → [JFreeChart 1.5.0](https://github.com/DeathStar3/jfreechart)
  - `jfreechart-refactored.yaml` → [JFreeChart 1.5.0](https://github.com/DeathStar3/jfreechart/tree/refactor) after the maintenance actions studied in section 5.2
- `jkube.yaml` → [JKube 1.7.0](https://github.com/eclipse/jkube)
- `openapi-generator.yaml` → [OpenAPI Generator 5.4.0](https://github.com/OpenAPITools/openapi-generator)
- `spring.yaml` → [Spring framework 5.2.3](https://github.com/Corpus-2021/spring-framework/tree/5.2.13-AnalysisReady)

Running the analysis of one project is done as follows, here illustrated with the `/data/jfreechart-1.5.0.yaml` file:

- First, run the VariMetrics server:

  - On GNU/Linux and macOS

  ```
  ./run-compose.sh
  ```

  - On Windows

  ```
  run-compose.bat
  ```

- Then, in another terminal:

  - On GNU/Linux and macOS

  ```
  ./run-docker-cli.sh -i /data/jfreechart-1.5.0.yaml -s /data/symfinder.yaml -verbosity INFO -http http://varicityback:3000/projects
  ```

  - On Windows

  ```
  run-docker-cli.bat -i /data/jfreechart-1.5.0.yaml -s /data/symfinder.yaml -verbosity INFO -http http://varicityback:3000/projects
  ```

*Notes:*
- Some analyses, such as the JDK, GeoTools or Azureus can take multiple hours.
More details about the analyzed projects and their definition are given in the "Using symfinder on your project" section in the README present in the artifact's root directory.
- The Docker images are automatically downloaded by Docker with the tag `splc2022` if they are not found on the host system.
If an image is not found, you can download it manually with the `docker pull` command.

Example:
```
docker pull deathstar3/symfinder-fetcher:splc2022
```

### Building symfinder

**This step is only needed if you edited symfinder's source code.**

You can build symfinder's Docker images by running

```
./build_symfinder.sh
```

Then, change the TAG variable in the `run-docker-cli` script from `splc2022` to `local`:

- On GNU/Linux and MacOS, edit `run-docker-cli.sh`
```
- TAG=splc2022
+ TAG=local
```

- On Windows, edit `run-docker-cli.bat`
```
- set tag=splc2022
+ set tag=local
```

### Checking that symfinder works
Hereafter, we illustrate the different steps of the execution of symfinder by giving excerpts of console outputs corresponding to the execution of symfinder on a single project, JKube.

1. First, symfinder clones the repository of the analyzed project, checking out the desired tags/commits.
```
$ ./run-docker-cli.sh -i /data/jkube.yaml -s /data/symfinder.yaml -verbosity INFO -http http://varicityback:3000/projects
Log Level is set to INFO. The underlying factory being used is org.slf4j.impl.JDK14LoggerFactory
Jun 08, 2022 5:24:54 PM fr.unice.i3s.sparks.deathstar3.sourcesfetcher.SourceFetcher cloneRepository
INFO: [/data/projects/jkube-v1.7.0]
```
2. Then, a Neo4j database used to store information about the analyzed project (classes, methods, identified variation points and variants…) is started.
Once operational, the symfinder engine parses the codebase of the project and populates the Neo4j database.
```
Starting Neo4J container this may take some time ....
Jun 08, 2022 5:24:55 PM fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants <clinit>
INFO: Initializing constants based on environment variables...
Jun 08, 2022 5:24:55 PM fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants <clinit>
INFO: Running inside Docker.
Jun 08, 2022 5:24:55 PM fr.unice.i3s.sparks.deathstar3.projectbuilder.Constants <clinit>
INFO: Using Neo4j deathstar3/symfinder-neo4j:vissoft2021
Jun 08, 2022 5:24:55 PM fr.unice.i3s.sparks.deathstar3.projectbuilder.Neo4JStarter startNeo4J
INFO: An instance of neo4j seems to be already running 
Jun 08, 2022 5:24:55 PM org.neo4j.driver.internal.logging.JULogger info
INFO: Direct driver instance 1596658651 created for server address symfinder-neo4j:7687
17:24:55.829 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - ClassesVisitor
17:24:56.282 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ClassesVisitor - Class: MavenWrapperDownloader
17:24:56.354 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ClassesVisitor - Class: zero.HelloController
17:24:56.378 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ClassesVisitor - Class: zero.Application
```
Five visitors are run on the codebase: `ClassesVisitor`, `GraphBuilderVisitor`, `StrategyTemplateDecoratorVisitor`, `FactoryVisitor`, and `ComposeTypeVisitor`.

3. At the end of the successive parsings, a summary of the results of the execution is given, and symfinder stops.
The information are then sent to the VariCity backend.
```
17:26:59.061 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ComposeTypeVisitor - Class: org.eclipse.jkube.maven.plugin.mojo.ManifestProvider
17:26:59.074 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ComposeTypeVisitor - Class: org.eclipse.jkube.maven.plugin.mojo.develop.LogMojo
17:26:59.107 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ComposeTypeVisitor - Class: org.eclipse.jkube.maven.plugin.mojo.develop.WatchMojo
17:26:59.162 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ComposeTypeVisitor - Class: org.eclipse.jkube.maven.plugin.mojo.develop.DebugMojo
17:26:59.189 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ComposeTypeVisitor - Class: org.eclipse.jkube.maven.plugin.mojo.develop.UndeployMojo
17:26:59.220 [pool-1-thread-1] INFO  fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.SymfinderVisitor - Visitor: fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ComposeTypeVisitor - Class: org.eclipse.jkube.maven.plugin.mojo.develop.DeployMojo
17:26:59.227 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - fr.unice.i3s.sparks.deathstar3.symfinder.engine.visitors.ComposeTypeVisitor execution time: 00:00:48.242
17:27:00.403 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of VPs: 268
17:27:00.405 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of methods VPs: 128
17:27:00.406 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of constructors VPs: 30
17:27:00.409 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of method level VPs: 158
17:27:00.410 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of class level VPs: 110
17:27:00.425 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of variants: 547
17:27:00.426 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of methods variants: 340
17:27:00.428 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of constructors variants: 73
17:27:00.430 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of method level variants: 413
17:27:00.431 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of class level variants: 134
17:27:00.434 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of nodes: 5044
17:27:00.438 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of relationships: 5554
17:27:00.443 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Number of corrected inheritance relationships: 144/772
Jun 08, 2022 5:27:01 PM org.neo4j.driver.internal.logging.JULogger info
INFO: Closing driver instance 1596658651
Jun 08, 2022 5:27:01 PM org.neo4j.driver.internal.logging.JULogger info
INFO: Closing connection pool towards symfinder-neo4j:7687
17:27:01.243 [pool-1-thread-1] MY_LEVEL fr.unice.i3s.sparks.deathstar3.symfinder.engine.entrypoint.Symfinder - Total execution time: 00:02:05.629
Jun 08, 2022 5:27:01 PM fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterJson writeResult
INFO: JSON path : /data/output/symfinder_files/jkube.json
Jun 08, 2022 5:27:01 PM fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterJson writeResult
INFO: JSON stats path : /data/output/symfinder_files/jkube-stats.json
```

5. Supposing that you run symfinder on JKube only, the `/data/output` directory shall now have the following structure:
```
/data/output/
└── symfinder_files
    ├── externals
    │   ├── jkube
    │   │   └── jkube-sonarcloud.json
    ├── jkube.json
    └── jkube-stats.json
```
Files in the `symfinder_files` directory (`jkube.json` and `jkube-stats.json`) correspond to files generated by analysing JFreeChart with symfinder.
The `externals` directory contains for each analyzed project the JSON files being the extracted metrics (here, `jkube-sonarcloud.json`). 

JKube has a SonarCloud page, therefore metrics were extracted from this page directly.

In the case of an analysis where a SonarQube server is run locally, the execution is done in parallel of symfinder.
Traces of the execution are also visible, but are mixed up with symfinder's traces.
Here's an example of hierarchy for a project requiring a local SonarQube server, JFreeChart. 
```
/data/output/
└── symfinder_files
    ├── externals
    │   ├── jfreechart-1.5.0
    │   │   └── jfreechart-1.5.0-sonarqube.json
    ├── jfreechart-1.5.0.json
    └── jfreechart-1.5.0-stats.json
```


### Troubleshooting known issues

#### Common issues

If at the end of your project analysis you have an output similar to the following:
```
org.springframework.web.client.ResourceAccessException: I/O error on POST request for "http://varicityback:3000/projects": varicityback; nested exception is java.net.UnknownHostException: varicityback
	at org.springframework.web.client.RestTemplate.doExecute(RestTemplate.java:785)
	at org.springframework.web.client.RestTemplate.execute(RestTemplate.java:711)
	at org.springframework.web.client.RestTemplate.postForEntity(RestTemplate.java:468)
	at fr.unice.i3s.sparks.deathstar3.serializer.ExperimentResultWriterHttp.writeResult(ExperimentResultWriterHttp.java:49)
	at fr.unice.i3s.sparks.deathstar3.symfinder.cli.App.run(App.java:136)
	at fr.unice.i3s.sparks.deathstar3.symfinder.cli.App.main(App.java:88)
Caused by: java.net.UnknownHostException: varicityback
	at java.base/java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:229)
	at java.base/java.net.Socket.connect(Socket.java:609)
	at java.base/java.net.Socket.connect(Socket.java:558)
	at java.base/sun.net.NetworkClient.doConnect(NetworkClient.java:182)
	at java.base/sun.net.www.http.HttpClient.openServer(HttpClient.java:474)
	at java.base/sun.net.www.http.HttpClient.openServer(HttpClient.java:569)
	at java.base/sun.net.www.http.HttpClient.<init>(HttpClient.java:242)
	at java.base/sun.net.www.http.HttpClient.New(HttpClient.java:341)
	at java.base/sun.net.www.http.HttpClient.New(HttpClient.java:362)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.getNewHttpClient(HttpURLConnection.java:1253)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.plainConnect0(HttpURLConnection.java:1187)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.plainConnect(HttpURLConnection.java:1081)
	at java.base/sun.net.www.protocol.http.HttpURLConnection.connect(HttpURLConnection.java:1015)
	at org.springframework.http.client.SimpleBufferingClientHttpRequest.executeInternal(SimpleBufferingClientHttpRequest.java:76)
	at org.springframework.http.client.AbstractBufferingClientHttpRequest.executeInternal(AbstractBufferingClientHttpRequest.java:48)
	at org.springframework.http.client.AbstractClientHttpRequest.execute(AbstractClientHttpRequest.java:66)
	at org.springframework.web.client.RestTemplate.doExecute(RestTemplate.java:776)
	... 5 more
```
This means that the VariCity backend is not running.
You then need to run the `run-compose.sh` script in another terminal before re-running the analysis.

#### Windows related issues

- If you run symfinder on a Windows system, symfinder must be placed somewhere on your `C:` drive.

- On Windows, you may encounter the following error:
```
docker.errors.DockerException: Credentials store error: StoreError('Credentials store docker-credential-osxkeychain exited with "The user name or passphrase you entered is not correct.".',)
[49981] Failed to execute script docker-compose
```
To solve this issue, you may open Docker Desktop and connect to your Docker Hub account.