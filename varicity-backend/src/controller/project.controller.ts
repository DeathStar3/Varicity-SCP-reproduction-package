import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { ExperimentResult } from 'src/model/experiment.model';
import {JsonInputInterface} from '../model/jsonInput.interface';
import {ProjectService} from "../service/project.service";


@Controller()
export class ProjectController {

    constructor(private readonly projectService: ProjectService) {
    }

    @Get('/projects/names')
    getAllProjectsNames(): string[] {
        return this.projectService.getAllProjectsName();
    }

    @Get('/projects/json/:name')
    loadProject(@Param() params): JsonInputInterface {
        return this.projectService.loadProject(params.name);
    }

    @Get('/projects/:name/metrics')
    getProjectMetrics(@Param('name') params): string[] {
        return this.projectService.getProjectMetrics(params);
    }

    @Post('/projects')
    newProject(@Body() experimentResult: ExperimentResult): string {
         this.projectService.addProject(experimentResult);
         return "OK";

    }
}
