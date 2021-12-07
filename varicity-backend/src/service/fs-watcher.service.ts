import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const path = require('path');
import { VaricityConfig } from 'src/model/config.model';
import { ConfigEntry, ProjectEntry } from 'src/model/experiment.model';
import { VaricityConfigService } from './config.service';
import { ProjectService } from './project.service';
import * as fs from 'fs';
import {
  JsonInputInterface,
  MetricClassInterface,
} from 'src/model/jsonInput.interface';
import { InitDBService } from 'src/startup/initdb';
import { DbFacadeService } from './db-facade/db-facade.service';
const fsextra = require('fs-extra');

export class FsWatcherService {
  private readonly pathToVisualizationConfigs: string;
  private readonly pathToSymfinderJsons: string;

  private readonly pathToWatchedConfigsDir: string;
  private readonly pathToWatchedSymfinderJsons: string;
  private readonly pathToWatchedMetricsJsons: string;
  private readonly pathToMetricsJsons: string;
  private readonly pathToParsedJsons: string;
  constructor(
    @Inject(DbFacadeService) private readonly dbFacade: DbFacadeService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(VaricityConfigService)
    private readonly varicityConfigService: VaricityConfigService,
    @Inject(ProjectService) private readonly projectService: ProjectService,
  ) {
    this.pathToVisualizationConfigs = this.configService.get<string>(
      'VISUALISATION_CONFIGS_PATH',
    );
    this.pathToSymfinderJsons = this.configService.get<string>('SYMFINDER_DIR');
    this.pathToMetricsJsons = this.configService.get<string>('METRICS_DIR');
    this.pathToParsedJsons = this.configService.get<string>('PARSED_INPUT_DIR');

    this.pathToWatchedConfigsDir = this.configService.get<string>(
      'WATCHED_CONFIGS_DIR',
    );
    this.pathToWatchedSymfinderJsons = this.configService.get<string>(
      'WATCHED_SYMFINDER_DIR',
    );
    this.pathToWatchedMetricsJsons = this.configService.get<string>(
      'WATCHED_METRICS_DIR',
    );
  }

  /**
   * Instantiate watchers for config files and data files
   * It also clean the database when the server is started
   */
  public async instantiateWatcher() {
    const chokidar = require('chokidar');

    chokidar.watch(this.pathToWatchedConfigsDir).on('all', (event, _path) => {
      console.log(event, _path);
      switch (event) {
        case 'add':
          this.indexConfigFile(_path);
          break;
        case 'unlink':
          this.deIndexConfigFile(_path);
          break;
      }
    });
    chokidar
      .watch(this.pathToWatchedSymfinderJsons)
      .on('all', (event, _path) => {
        console.log(event, _path);
        if (event === 'add') {
          this.indexDataFile(_path);
        }
      });

    console.log('Watching directories:');
    console.log(' - ' + this.pathToWatchedConfigsDir);
    console.log(' - ' + this.pathToWatchedSymfinderJsons);
  }

  /**
   * Index a config file
   */
  public indexConfigFile(configFilePath: string) {
    console.log('IndexConfigFile ', configFilePath);

    if (!this.varicityConfigService.checkIfConfigIsIndexed(configFilePath)) {
      //we read the file to get the human readable name of the config but it is ok because we only do it once at startup
      const configObject = VaricityConfigService.getYamlFromDisk(
        configFilePath,
      ) as VaricityConfig;

      this.dbFacade.db.push(
        '/configs[]',
        new ConfigEntry(
          configObject.name,
          configFilePath,
          configObject.projectId,
        ),
      );
    }
  }

  /**
   * DeIndex a deleted config file
   */
  public deIndexConfigFile(configFilePath: string) {
    console.log('DeIndexConfigFile', configFilePath);
    if (this.varicityConfigService.checkIfConfigIsIndexed(configFilePath)) {
      this.dbFacade.db.delete(
        `/configs[${this.dbFacade.db.getIndex(
          '/configs',
          configFilePath,
          'path',
        )}]`,
      );
    }
  }

  /**
   * Index a data file
   */
  public indexDataFile(dataFilePath: string) {
    const projectName = path.parse(dataFilePath).name;
    console.log('indexDataFile', projectName);
    if (!this.projectService.checkIfParsed(projectName)) {
      this.parseSymfinderJsons(dataFilePath, projectName);
    }
  }

  getExternalMetricsPaths(projectName: string) {
    const fullPath = path.join(this.pathToMetricsJsons, projectName);
    if (fs.existsSync(fullPath)) {
      return fs
        .readdirSync(fullPath, { withFileTypes: true })
        .filter(
          (f) =>
            f.isFile() &&
            path.extname(f.name).toLowerCase() === InitDBService.EXTENSION,
        )
        .map((f) =>
          path.resolve(path.join(this.pathToMetricsJsons, projectName, f.name)),
        );
    }
    return [];
  }

  parseSymfinderJsons(fullPath: string, projectName: string) {
    const symfinderObj = JSON.parse(
      fs.readFileSync(fullPath, 'utf8'),
    ) as JsonInputInterface;
    const externalsMetricsPaths = this.getExternalMetricsPaths(projectName);

    if (externalsMetricsPaths.length !== 0) {
      // index all classes indexes to reduce the complexity of merging external jsons.
      const mapSymFinderClassesIndex =
        ProjectService.indexSymFinderClassesToMap(symfinderObj);

      // loop over all the external metrics Json for the project
      externalsMetricsPaths.forEach((externalsMetricsPath) => {
        // get the object of external metrics
        const externalMetricsClasses = JSON.parse(
          fs.readFileSync(externalsMetricsPath, 'utf8'),
        ) as MetricClassInterface[];

        // loop over all the classes in the external jsons object
        externalMetricsClasses.forEach((classMetrics) => {
          if (mapSymFinderClassesIndex.has(classMetrics.name)) {
            const index = mapSymFinderClassesIndex.get(classMetrics.name);
            if (symfinderObj.nodes[index].additionalMetrics === undefined) {
              symfinderObj.nodes[index].additionalMetrics = [];
            }

            // aggregate the metrics in the SymFinder object classes.
            classMetrics.metrics.forEach((metric) => {
              symfinderObj.nodes[index].additionalMetrics.push(metric);
            });
          }
        });
      });
    }

    console.log(this.dbFacade.db.getData('/'));
    const parsedInputPath = path.join(this.pathToParsedJsons, projectName);
    fs.mkdirSync(this.pathToParsedJsons, { recursive: true });
    fsextra.writeJsonSync(`${parsedInputPath}.json`, symfinderObj, {
      flag: 'w+',
      recursive: true,
    });
    this.dbFacade.db.push(
      '/projects[]',
      new ProjectEntry(projectName, parsedInputPath + '.json'),
    );
  }

  /**
   * Get the project name from config file path
   */
  public getConfigProjectName(_path: string): string {
    const newPath = _path.replace(/\\+/g, '/');
    const newPathSplit = newPath.split('/');
    return newPathSplit[1];
  }

  /**
   * Get the project name from data file path
   */
  public getDataProjectName(_path: string): string {
    const newPath = _path.replace(/\\+/g, '/');
    const newPathSplit = newPath.split('/');
    if (newPathSplit[2] === 'externals') {
      return newPathSplit[3];
    } else {
      return newPathSplit[2].replace('.json', '');
    }
  }

  /**
   * Normalize data file path (remove "data/symfinder_files/")
   */
  public normalizeDataFileName(_path: string): string {
    const newPath = _path.replace(/\\+/g, '/');
    const newPathSplit = newPath.split('/');
    newPathSplit.shift(); // Remove "data/"
    newPathSplit.shift(); // Remove "symfinder_files/"
    return newPathSplit.join('/');
  }

  /**
   * Normalize config file path (remove "config/)
   */
  public normalizeConfigFileName(_path: string): string {
    const newPath = _path.replace(/\\+/g, '/');
    const newPathSplit = newPath.split('/');
    newPathSplit.shift(); // Remove "config/"
    return newPathSplit.join('/');
  }
}
