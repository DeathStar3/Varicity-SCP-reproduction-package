import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { ExperimentResult, ProjectEntry } from 'src/model/experiment.model';
import { JsonInputInterface } from '../model/jsonInput.interface';
import { DbFacadeService } from './db-facade/db-facade.service';
const fsextra = require('fs-extra');
const path = require('path');

export class ProjectService {
  private readonly pathToSymfinderJsons: string;
  private readonly pathToMetricsJsons: string;
  private readonly persistentDir: string;

  private readonly pathToParsedJsons: string;

  constructor(
    @Inject(DbFacadeService) private readonly dbFacade: DbFacadeService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {
    this.pathToSymfinderJsons = this.configService.get<string>('SYMFINDER_DIR');
    this.persistentDir = this.configService.get<string>('PERSISTENT_DIR');
    this.pathToMetricsJsons = this.configService.get<string>('METRICS_DIR');
    this.pathToParsedJsons = this.configService.get<string>('PARSED_INPUT_DIR');
  }

  /******************
   * LOAD A PROJECT *
   ******************/

  /**
   * Load SymFinder and external metrics jsons for a given project and merge them into a single object
   */
  public loadProject(projectName: string): JsonInputInterface {
    const projectObj = this.dbFacade.db.find(
      '/projects',
      (project, _index) => project.projectName === projectName,
    ) as ProjectEntry;
    if (projectObj) {
      return JSON.parse(
        fs.readFileSync(projectObj.path, 'utf8'),
      ) as JsonInputInterface;
    }
    return undefined;
  }

  /**
   * Create a map base on SymFinder json, the map is then used to easily merge the SymFinder data with the external metrics
   */
  public static indexSymFinderClassesToMap(symfinderObj: JsonInputInterface) {
    const mapSymFinderClassesIndex = new Map<string, number>();
    for (let i = 0; i < symfinderObj.nodes.length; i++) {
      mapSymFinderClassesIndex.set(symfinderObj.nodes[i].name, i);
    }
    return mapSymFinderClassesIndex;
  }

  /**
   * Return a list with all the project names
   */
  public getAllProjectsName(): string[] {
    if (this.dbFacade.db.exists('/projects')) {
      return this.dbFacade.db.getData('/projects').map((p) => p.projectName);
    }
    return [];
  }

  /**
   * Return all the External and Variability metrics from the specified project
   * @param projectName
   */
  public getProjectMetrics(projectName): string[] {
    return [
      ...this.getProjectMetricsExternal(projectName),
      ...this.getProjectMetricsVariability(projectName),
    ];
  }

  /**
   * Get only the variability metrics that are calculated in Varicity
   * @param projectName
   */
  getProjectMetricsVariability(projectName): string[] {
    return [
      VariabilityMetricsName.NB_METHOD_VARIANTS,
      VariabilityMetricsName.NB_ATTRIBUTES,
      VariabilityMetricsName.NB_CONSTRUCTOR_VARIANTS,
      VariabilityMetricsName.NB_VARIANTS,
    ];
  }

  /**
   * Get the external metric names from the project specified
   * @param projectName
   */
  getProjectMetricsExternal(projectName): string[] {
    const project = this.loadProject(projectName);
    const metrics = new Set<string>();

    // TODO save in DB after first time
    project.nodes.forEach((node) => {
      if (node.additionalMetrics !== undefined) {
        node.additionalMetrics.forEach((metric) => {
          metrics.add(metric.name);
        });
      }
    });

    return [...metrics.keys()];
  }

  parseExperimentResultToJsonInputInterface(
    project: ExperimentResult,
  ): JsonInputInterface {
    console.log(project)
    const symfinderObj = JSON.parse(
      project.symfinderResult.vpJsonGraph,
    ) as JsonInputInterface;

    if (project.externalMetric.size !== 0) {
      // index all classes indexes to reduce the complexity of merging external jsons.
      const mapSymFinderClassesIndex =
        ProjectService.indexSymFinderClassesToMap(symfinderObj);

      // loop over all the external metrics Json for the project
      project.externalMetric.forEach((externalMetricsClasses, source) => {
        // get the object of external metrics

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
    return symfinderObj;
  }

  addProject(project: ExperimentResult) {
    let index = 0;

    //write the unparsed result
    if (project.externalMetric !== undefined && project.externalMetric !== null && project.externalMetric.size > 0) {
      project.externalMetric.forEach((nodes, sourceName) => {
        fs.mkdirSync(path.join(this.pathToMetricsJsons, sourceName), { recursive: true });
        fsextra.writeJsonSync(path.join(this.pathToMetricsJsons, sourceName, `${project.projectName}-${sourceName}.json`), nodes, { flag: 'w+' });
      });
    }

    if (project.symfinderResult && project.symfinderResult != null && project.symfinderResult != undefined && project.symfinderResult.vpJsonGraph && project.symfinderResult.vpJsonGraph.trim().length > 0) {
      fs.writeFileSync(path.join(this.pathToSymfinderJsons, `${project.projectName}.json`), project.symfinderResult.vpJsonGraph,);
    }
    //parse the result
    const symfinderObj = this.parseExperimentResultToJsonInputInterface(project);

    //write the parsed result

    const parsedInputPath = path.join(this.pathToParsedJsons, project.projectName,);
    fs.mkdirSync(this.pathToParsedJsons, { recursive: true });
    fsextra.writeJsonSync(`${parsedInputPath}.json`, symfinderObj, { flag: 'w+', recursive: true });

    //update the entry in the database
    if (this.dbFacade.db.exists('/projects')) {
      index = this.dbFacade.db.getIndex('/projects', project.projectName, 'projectName');
      if (index > -1) {
        this.dbFacade.db.push(`/projects[${index}]`, new ProjectEntry(project.projectName, parsedInputPath + '.json'));
      } else {
        this.dbFacade.db.push(`/projects[]`, new ProjectEntry(project.projectName, parsedInputPath + '.json'),);
      }
    } else {
      this.dbFacade.db.push(`/projects[]`, new ProjectEntry(project.projectName, parsedInputPath + '.json'));
    }
  }

  /**
   * To check if a file is already parsed we will use the database instead of the filesystem
   * If a change is done manually on the filesystem to the 'gross' results then the user has the responsibility to remove
   * the previous parsed result and delete the entry from the database.
   * @param projectName
   */
  checkIfParsed(projectName: string) {
    if (this.dbFacade.db.exists('/projects')) {
      return this.dbFacade.db.getIndex('/projects', projectName, 'projectName') > -1 ||
          (this.dbFacade.db.getData("/projects") as {path: string, projectName: string}[]).some(
              (project) => project.path.includes(projectName)
          )
    }
    return false;
  }
}
