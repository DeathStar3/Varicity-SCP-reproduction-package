import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { endWith } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AppService } from './app.service';
import { FilesLoader } from './filesLoader';
import { VaricityConfig } from './models/config.model';
import { JsonInputInterface } from './models/jsonInput.interface';
import { CityViewConfig, Project, User } from './models/user.model';


@Controller()
export class AppController {

  db = new JsonDB(new Config("varicitydb", true, true, '/'));
  constructor(private readonly appService: AppService) {

    console.log(this.db.exists('/'))


  }



  @Get()
  getHello(): string {
    return this.appService.getHello();
  }



  @Get('/projects/name/:name')
  getVisualizationData(@Param() params): JsonInputInterface {
    console.log('Wrong function is called')
    return FilesLoader.loadVisualizationInfoOfProject(params.name);

  }


  @Post('/projects/:index/configs')
  saveConfig(@Param() params, @Body() config: VaricityConfig): VaricityConfig {

    config.timestamp = new Date().toISOString();
    this.db.push(`/projects[${params.index}]/configs[]`, config);

    return config;
  }

  @Get('/projects')
  findAllProjects(): string[] {
    return this.db.filter<Project>('/projects', (entry: any, index: any) => true).map((project: { projectName: any; }) => project.projectName)
  }

  @Get('/projects/configs')
  getConfigsOfProject(@Query() query: Record<string, any>): VaricityConfig[] {

    console.log(query)
    try {
      let project: any = this.db.find('/projects', (entry: { projectName: any; }, _index: any) => entry.projectName === query['name']);
      if (project) {
        console.log('Fiirst ')
        if (project.configs && project.configs.length && project.configs.length > 0) {
          console.log('2nd ')
          return project.configs;
        }
        else {
          console.log('3rd ')
          return [this.appService.loadDefaultConfig()];
        }

      }
      else{
        console.log('4th')
        return [this.appService.loadDefaultConfig()];
      }
    } catch (error) {
      console.log('5th ')
      console.log(error);
    }
    console.log('6th ')
    return [];
  }

  @Get('/projects/configs/firstOrDefault')
  getFirstOrDefaultConfigProject(@Query() query: Record<string, any>): VaricityConfig {

    try {
      let project: any = this.db.find('/projects', (entry: { projectName: any; }, index: any) => entry.projectName === query['name']);

      if (project) {
        if (project.configs) {
          return project.configs[0] || this.appService.loadDefaultConfig();
        }
        else {
          return this.appService.loadDefaultConfig();
        }

      }
      else {
        console.log('No project with this name');
      }
    } catch (error) {
      console.log(error);
    }


  }

  @Post('/projects')
  newProject(@Body() project: Project): Project {
    let index = 0;

    if (this.db.exists('/projects')) {
      index = this.db.count("/projects");
      const existingProject = this.db.find<Project>('/users', (entry: { projectName: string; }, _: any) => entry.projectName == project.projectName);

      if (existingProject) {
        return existingProject;
      }

    }
    project.index = index;
    this.db.push(`/projects[]`, project);


    return project;
  }

  @Get('/configs')
  getConfigsOfUser(@Query() query: Record<string, any>): VaricityConfig[] {
    let project: { configs: VaricityConfig[] } = this.db.find('/projects', (entry: { projectName: any; }, index: any) => entry.projectName == query['projectName'])
    return project.configs.filter((entry, index) => entry.username == query['username']);

  }

  //todo get
  @Post('/users')
  registerOrConnect(@Body() user: User): User {

    try {

      console.log(this.db.count("/users"))
    } catch (error) {

    }

    try {

      const existingUser = this.db.find<User>('/users', (entry: { username: string; }, index: any) => entry.username == user.username);
      console.log(existingUser);
      if (existingUser) {
        return existingUser;
      }
      else {
        user.id = uuidv4();
        this.db.push('/users[]', user);
        return user;
      }
    } catch (error) {
      user.id = uuidv4();
      user.index = 0;
      this.db.push('/users[]', user);
      return user;
    }


  }
}
