# VariCity-backend

The Varicity-Backend is a REST stores and pre-parse the results extracted by Symfinder. It also stores the Visualization Configurations.

<p align="center">
  <img src="images/rest-routes.png" alt="Available REST routes" />
</p>

### Building VariCity-backend

To use Varicity-backend just run `build-docker-image.(sh|bat)` depending on your OS.


### Develop and modify VariCity-backend
[!Requirements]
If you want to develop the backend, you will need the following
- Node 16
- NPM 7.10

__Installation__

```bash
$ npm install
```

__Running the app__

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


### VariCity-backend configuration
Here is the list of environment variables you can use to change the behavior of Varicity-Backend
You can modify their default values in the `.env` or by setting an environment variable with the same names.

```properties
PERSISTENT_DIR=./persistent
SYMFINDER_DIR=./persistent/data/symfinder_files
METRICS_DIR=./persistent/data/symfinder_files/externals
PARSED_INPUT_DIR=./persistent/data/symfinder_files/parsed
DATABASE_PATH=./persistent/varicitydb
VISUALISATION_CONFIGS_PATH=./persistent/configs
DEFAULT_CONFIGS_DIR=./persistent/default-configs
WATCH_DIRECTORIES=1
WATCHED_CONFIGS_DIR=./persistent/manual/configs
WATCHED_SYMFINDER_DIR=./persistent/manual/symfinder_files
```

__Description of some variables__

| Environment variables | Type   | Description                                                                                                                                                                                          |
| --------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WATCH_DIRECTORIES     | int    | Whether or not to use a file watcher to index new configs or experiments you might add , default value is 1 meaning true, put it to 0 to deactivate the file watcher                                 |
| WATCH_DIRECTORIES     | string | The directory where you can put your new configs manually. If you place a config there it will be picked up by the file watcher if it is activated                                                   |
| WATCHED_SYMFINDER_DIR | string | The directory where you can put your symfinder_files manually. If you also have the metrics file of your project place them in `METRICS_DIR` **before** placing the result of the symfinder_analysis |
| PARSED_INPUT_DIR      | string | When a symfinder_analysis is posted to Varicity Backend or detected by the file watcher it will be parsed and the result will be save in `PARSED_INPUT_DIR`                                            |
### Technological stack
Varicity-Backend was developped with the Nestjs.
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">