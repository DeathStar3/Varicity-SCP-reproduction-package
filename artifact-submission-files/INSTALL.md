# Installation instructions

In this document, we assume that you already have a system with:
- a fully functional Docker and Docker Compose installed;
- a web browser (our tests have been made with Google Chrome, Mozilla Firefox, Safari and Edge).

See the `REQUIREMENTS.md` file for more details.

## Running varicity _TODOS #updateName_

All the scripts in this section are located and executed from the root of the varicity artifact.

### Reusing the existing Docker image

varicity is available as a Docker image hosted on the [Docker Hub](https://hub.docker.com/r/deathstar3/varicity),
allowing to use it without needing to build it.

Run varicity by running

- On GNU/Linux

    ```
    ./run-compose.sh
    ```

*Note:* Docker automatically downloads the image with the `scp2024` tag if it is not found on the host system.

You can also download it manually with:
```
docker pull deathstar3/varicity:scp2024
```



Varicity is a NodeJS application written in TypeScript deployed in a webpack environment.
The Docker container exposes the application as a server, which is accessed through your web browser.

### Checking that varicity works

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
- By clicking on the desired project's name, you can then select the configuration you want to visualize while a first visualization is loading, here Nest.
  Please note that the visualization may not be centered when appearing. The rendering time of the visualization increases with the number of buildings to display.
  To limit the loading time when switching between projects, we advise to reduce the value of the usage level to limit the number of buildings to render.

  ![visu_selection_panel](images/visu_selection_panel.png) _TODO #changeMenuImage_
- By selecting the `Varicity view - Figure 2` configuration, we obtain the following view:
  ![jfreechart_visualization](images/jfreechart_visualization.png) _TODO #changeMenuImage_

### Building varicity

**This step is only needed if you edited varicity's source code.**

You can build varicity's Docker images by running

```
./build_varicity_ts.sh 
```

Then, change the TAG variable in the `run-compose` script from `scp2024` to `local`:

- On GNU/Linux, edit `run-compose.sh`
```
- export TAG=scp2024
+ export TAG=local
```

## Running a Symfinder-TS analysis

Reproducing the pre-generated visualizations is done by executing their analysis before visualizing it in varicity.
All scripts used in this section are located in the artifact's root directory.

### Reusing the existing Docker images

The following Docker images hosted on the [Docker Hub](https://hub.docker.com/) allow to use symfinder-ts without needing to build it.


```
deathstar3/symfinder-ts-cli
deathstar3/varicity-ts
deathstar3/varicity-backend-ts
```

In addition, running a symfinder-ts analysis requires a Neo4j Docker image automatically pulled by the running script.

The symfinder-ts cli uses Github links to run, example: `https://github.com/nestjs/nest`.  
Links to all studied projects are provided in `PROJECTS.md`

Running the analysis of one project is done as follows, here illustrated with the project [Nest](https://github.com/nestjs/nest):

- First, run the varicity server:

  - On GNU/Linux

  ```
  ./run-compose.sh
  ```

- Then, in another terminal:

  - On GNU/Linux

  ```
  ./run-docker-cli.sh https://github.com/nestjs/nest -http
  ```

*Notes:*
- Some analyses, such as Azure Data Studiom VS Code, Grafana or Angular can take multiple hours.
--More details about the analyzed projects and their definition are given in the "Using symfinder on your project" section in the README present in the artifact's root directory.--
- The Docker images are automatically downloaded by Docker with the tag `scp2024` if they are not found on the host system.
If an image is not found, you can download it manually with the `docker pull` command.

Example:
```
docker pull deathstar3/symfinder-ts-cli:scp2024
```

### Checking that symfinder works _TODO #update symfinder stacktrace_
Hereafter, we illustrate the different steps of the execution of symfinder by giving excerpts of console outputs corresponding to the execution of symfinder on a single project, Echarts.

1. First, a Neo4j database used to store information about the analyzed project (classes, methods, identified variation points and variants…) is started. _TODO #Update stack_
```
$ ./run-docker-cli.sh https://github.com/nestjs/nest -http
TODO UPDATE
```

2. Then, symfinder clones the repository of the analyzed project. It is downloaded and then unziped, the operation can take a certain amount of time. _TODO #Update stack_
```
TODO UPDATE
```

3. Once cloned, the symfinder engine parses the codebase of the project and populates the Neo4j database. _TODO #Update stack_
```
TODO UPDATE
```
Five visitors are run on the codebase: `ClassesVisitor`, `GraphBuilderVisitor`, `DecoratorFactoryTemplateVisitor`, `StrategyVisitor`, and `UsageVisitor`.

3. At the end of the successive parsings, a summary of the results of the execution is given, and symfinder stops.
The information are then sent to the varicity backend. _TODO #Update stack_
```
TODO UPDATE
```

5. Supposing that you run symfinder on Nest only, the `/dockervolume/data` directory shall now have the following structure:
```
/data/symfinder_files/
└── parsed
    ├── nest.json
└── nest.json    
```
Files in the `symfinder_files` directory (`nest.json`) correspond to files generated by analysing Nest with symfinder.

### Building symfinder

**This step is only needed if you edited symfinder's source code.**

You can build symfinder's Docker images by running

```
./build_symfinder_ts.sh
```

Then, change the TAG variable in the `run-docker-cli` script from `scp2024` to `local`:

- On GNU/Linux, edit `run-docker-cli.sh`
```
- TAG=scp2024
+ TAG=local
```

### Troubleshooting known issues

#### Common issues

- If at the end of your project analysis you have an output similar to the following:
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
This means that the varicity backend is not running.
You then need to run the `run-compose.sh` script in another terminal before re-running the analysis.

- If you obtain the following message:
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```
This means that the Docker service is not running on your machine. Start the Docker service.

- If you obtain the following message:
```
ERROR: for <container_name>  Cannot create container for service <container_name>: Conflict. The container name "<container_name>" is already in use by container "XXXX". You have to remove (or rename) that container to be able to reuse that name.
```
You need to remove the container whose name is already in use.
```
$ docker stop <container_name>
$ docker rm <container_name>
```

#### Windows related issues

- If you run symfinder on a Windows system, symfinder must be placed somewhere on your `C:` drive.

- On Windows, you may encounter the following error:
```
docker.errors.DockerException: Credentials store error: StoreError('Credentials store docker-credential-osxkeychain exited with "The user name or passphrase you entered is not correct.".',)
[49981] Failed to execute script docker-compose
```
To solve this issue, you may open Docker Desktop and connect to your Docker Hub account.