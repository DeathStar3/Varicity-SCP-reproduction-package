# Varicity

## General Requirements
Those are general requirements, depending of the method you choose you won't need all of them.
- Docker (cli and deamon)
- Docker-Compose
- JDK 17
- the JAVA_HOME environment variable must be defined and pointing to a JDK >= 11
- Maven
- Internet Connexion
- Free disk space over 15 GB (To download the images and also because Sonarqube exits when disk space is low )
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
./new-run-cli.sh <experiment-configuration>  <hotspot-configuration> <LOG_LEVEL>
```
| Arguments         | Type    | Description |
|--------------|-----------|------------|
|experiment-configuration| string | the absolute or relative path of the file containing your configuration for your experiment See [Documentation](Wiki.md) for the format of the file|
| hotspot-configuration | string | the absolute or relative path of the file containing your hotspot configuration. See [Documentation](Wiki.md) for the format of the file.|
| LOG_LEVEL | string | the verbosity of the program possible values are `"TRACE", "DEBUG", "INFO", "WARN", "ERROR"`. You can use any case (lowercase,uppercase) you want.

### With docker-cli
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