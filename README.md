# VariCity-Config

<p align="center">
<img src="varicity/public/images/logovaricity.gif" width="200" alt="Logo"/>
</p>

**VariCity** is a 3D visualization relying on the city metaphor to display zones of high density of variability
implementations in a single system. The city is built by creating building, corresponding to classes, and streets,
grouping every class linked to the street's starting building.

**SymFinder** is a toolchain parsing a single Java codebase to identify potential variability implementations.
The output of SymFinder consists in JSON files containing information on the presence of variability implementations in the analysed codebase (e.g. if a class has been identified as a variation point or a variant, number of variants of an identified variation point…).

**Metrics-extension** is a tool allowing you to retrieve metrics from external sources such as SonarCloud . . . .

**VariCity-backend** . . . .

## Documentation
- [Go to symfinder's documentation](./metrics-extension/symfinder/README.md)
- [Go to metrics-extension's documentation](./metrics-extension/README.md)
- [Go to varicity-backend's documentation](./varicity-backend/README.md)
- [Go to varicity's documentation](./varicity/README.md)

## Authors

Authors | Contact
----------------------------------------------------------- | ----------------------------------------------------------
[Patrick Anagonou](https://github.com/anagonousourou)       | [sourou-patrick.anagonou@etu.univ-cotedazur.fr](mailto:sourou-patrick.anagonou@etu.univ-cotedazur.fr)
[Guillaume Savornin](https://github.com/GuillaumeSavornin)  | [guillaume.savornin@etu.univ-cotedazur.fr](mailto:guillaume.savornin@etu.univ-cotedazur.fr)
[Anton van der Tuijn](https://github.com/Anton-vanderTuijn) | [anton.van-der-tuijn@etu.univ-cotedazur.fr](mailto:anton.van-der-tuijn@etu.univ-cotedazur.fr)




<!--
TODO need to be move in the corresponding readme

## Build it

### Requirements 
- Docker
- JDK 17
- the JAVA_HOME environment variable must be defined and pointing to a JDK >= 11
- Maven
- Internet Connexion

Run the below command
```sh
bash new-build.sh
```

## Run it

```sh
bash new-run.sh
```

## Use it

- Go to http://localhost:9090/experiment.html
- Load a configuration for your experiment in the input dedicated for that, click Run Experiment
- You should see a snackbar informing you that your experiment has started, wait till it is completed it can take from a couple of minutes to tens on minutes
- If there is a problem with the configuration you provided you will get a snackbar or a dialog with details on what went wrong
- When your experiment is finished you will also get a snackbar message or a dialog
- Now go to http://localhost:9090/ui.html
- You should see the name of your project in the options of the  -- Select a project -- Select
- Once you select your project you won't be able to see anything except for a red rectangle. It is normal you need to start adding api_classes to get a visualization
- Use the Documentation button to get help

-->