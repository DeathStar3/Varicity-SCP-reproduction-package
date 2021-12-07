# Varicity

## Technological Stack
- NestJs
- Quarkus
- Webpack
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="122" height="122" alt="Nest Logo" /></a>
<a href="http://nestjs.com/" target="blank"><img class="logo" src="https://webpack.js.org/site-logo.1fcab817090e78435061.svg" alt="webpack logo" width="122" height="122"></a>
</p>

## General Requirements
Those are general requirements, depending of the method you choose you won't need all of them.
- Docker (cli and deamon)
- Docker-Compose
- JDK 17
- the JAVA_HOME environment variable must be defined and pointing to a JDK >= 11
- Maven
- Internet Connexion
- Free disk space over 15 GB (To download the images and also because Sonarqube exits when disk space is low )
## Integrate in your own tool
This extension has been built in modular way. This makes it possible to insert 
## Symfinder with the terminal (console) interface
First you need to generate the data with symfinder.

### Without docker-cli
With this method you will need JDK 17 + `mvn`. You won't need the `docker` command but you will still need to have a docker
daemon. Use the below command to check if your docker daemon is runnig. (Command not tested on Windows).
```shell
curl --unix-socket /var/run/docker.sock http://localhost/version
```
First build the new Symfinder 
```shell
chmod +x new-build-cli.sh
./new-build-cli.sh
```
Then to use it  (replace <> by the right value for your usage). See below for details

```shell
chmod +x new-run-cli.sh
./new-run-cli.sh -i <experiment-configuration> -s <hotspot-configuration> -verbosity <LOG_LEVEL> -http <url>
```
| Options/Arguments         | Type    | Description |
|--------------|-----------|------------|
|-i | string | the absolute or relative path of the file containing your configuration for your experiment See [Documentation](Wiki.md) for the format of the file|
| -s | string | the absolute or relative path of the file containing your hotspot configuration. See [Documentation](Wiki.md) for the format of the file.|
| LOG_LEVEL | string | the verbosity of the program possible values are `"TRACE", "DEBUG", "INFO", "WARN", "ERROR"`. You can use any case (lowercase,uppercase) you want.|
| -http | string | An url where you want the result of the analysis to be posted using `HTTP/POST`. Eg `http://localhost:3000/projects`. Nothing will be written on disk if you use that option|

### With docker-cli
If you use this then you are using Docker out of Docker. The advantage is that you don't need Java or mvn on your machine
First build the image. 
```shell
chmod +x new-build-docker-cli.sh
./new-build-docker-cli.sh
```
Given you are using Docker you need to mount a volume to share files between your host and the docker container.
For the sake of simplicity, one (1) volume is enough. So put all your configurations files (experiments and hotspots) and projects (if already on the disk) in a directory /
sub-directories of where you are lauching your command.
The script mount your current directory to the docker container under `/data`. 
So for the path of the files your need to take that into account.
You need to take that into account for the `path` and `outputPath` in the experiments config.
If you are using the option `-http`, then you can't use `localhost` your url must be accessible through the internet or must be 
a docker container in the same network as symfinder-cli. There will be more details on this in other sections.
When using docker you need to provide a `path`.
```shell
chmod +x new-run-docker-cli.sh
./new-run-docker-cli.sh -i <experiment-configuration> -s <hotspot-configuration> -verbosity <LOG_LEVEL> -http <url>
```


**COMING SOON**

## Use Symfinder with a web interface
Here also you have the choice to run some of the components on your machine if you have the right requirements,
or use only docker containers with docker-compose.
**THIS SECTION IS NOT READY YET**
### With docker-compose
### Build it



Run the below command
```sh
bash new-build.sh
```

### Run it

```sh
bash new-run.sh
```


### Use it

- Go to http://localhost:9090/experiment.html
- Load a configuration for your experiment in the input dedicated for that, click Run Experiment
- You should see a snackbar informing you that your experiment has started, wait till it is completed it can take from a couple of minutes to tens on minutes
- If there is a problem with the configuration you provided you will get a snackbar or a dialog with details on what went wrong
- When your experiment is finished you will also get a snackbar message or a dialog
- Now go to http://localhost:9090/ui.html
- You should see the name of your project in the options of the  -- Select a project -- Select
- Once you select your project you won't be able to see anything except for a red rectangle. It is normal you need to start adding api_classes to get a visualization
- Use the Documentation button to get help

## NB
Some dockerfiles or scripts have `local` in their filename. These are dockerfiles where the build part happens on the machine. 
It saves the developpers the time needed for the docker container (build) to download all dependencies from maven.