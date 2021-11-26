import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {JsonInputInterface} from '../model/jsonInput.interface';
import {ProjectService} from "../service/project.service";
import {Project} from "../model/user.model";


@Controller()
export class ProjectController {

    constructor(private readonly projectService: ProjectService) {
    }

    /*
    *  /projects                                get all project                                                         | .json (nx)
    *  /projects/:name                          get specific project                                                    | .jons (1x)
    *
    *
    *  /projects                                get all projects                                                        | .json (nx)
    *  /projects/names                          get specific project                                                    | string (nx)
    *  /projects/names/:name                    get specific project                                                    | string (nx)
    *
    *  /projects/configs                        get all last configs for all projects                                   | .yaml (nx)
    *  /projects/:name/configs                  get all last configs versions of a specific project                     |
    *  /projects/:name/configs/names            get last version of a specific config of specific project
    *  /projects/:name/configs/:name            get last version of a specific config of specific project
    *
    * */

    @Get('/projects/names')
    getAllProjectsNames(): string[] {
        return this.projectService.getAllProjectsName();
    }

    @Get('/projects/name/:name')
    getVisualizationData(@Param() params): JsonInputInterface {
        return this.projectService.loadVisualizationInfoOfProject(params.name);
    }

    @Get('/projects')
    findAllProjects(): string[] {
        return this.projectService.getAllFilenames();
    }

    @Post('/projects')
    newProject(@Body() project: Project): Project {
        return this.projectService.addProject(project);
    }
}
