import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {JsonDB} from 'node-json-db';
import {Config} from 'node-json-db/dist/lib/JsonDBConfig';
import {v4 as uuidv4} from 'uuid';
import {ConfigService} from '../service/config.service';
import {VaricityConfig} from '../model/config.model';


@Controller()
export class ConfigController {

    constructor(private readonly configService: ConfigService) {
    }

    @Post('/projects/configs')
    saveConfig(@Body() config: VaricityConfig): VaricityConfig {
        console.log("/projects/configs - saveConfig, ", config)
        return this.configService.saveConfig(config);
    }

    @Get('/projects/configs')
    getConfigsOfProject(@Query() query: Record<string, any>): VaricityConfig[] {
        console.log("/projects/configs - getConfigsOfProject", query)
        const res =  this.configService.loadConfigFiles(query['name']);
        console.log(res);
        return res;
    }

    @Get('/projects/configs/firstOrDefault')
    getFirstOrDefaultConfigProject(@Query() query: Record<string, any>): VaricityConfig {
        console.log("/projects/configs/firstOrDefault - getFirstOrDefaultConfigProject", query)
        return this.configService.loadDataFile(query['name']);
    }

    @Get('/configs')
    getConfigsOfUser(@Query() query: Record<string, any>): VaricityConfig[] {
        console.log("/configs - getConfigsOfUser", query)
        // TODO
        // let project: { configs: VaricityConfig[] } = this.db.find('/projects', (entry: { projectName: any; }, index: any) => entry.projectName == query['projectName'])
        // return project.configs.filter((entry, index) => entry.username == query['username']);
        return [];
    }
}
