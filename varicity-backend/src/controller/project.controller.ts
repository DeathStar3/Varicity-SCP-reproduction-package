import {Controller, Get, Param, Post} from '@nestjs/common';
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
}
