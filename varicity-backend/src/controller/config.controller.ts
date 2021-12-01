import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ConfigService} from '../service/config.service';
import {VaricityConfig} from '../model/config.model';


@Controller()
export class ConfigController {

    constructor(private readonly configService: ConfigService) {
    }

    @Post('/projects/configs')
    saveConfig(@Body() config: VaricityConfig): any {
        console.log("/projects/configs - saveConfig, ", config)
        return this.configService.saveConfig(config);
    }

    @Get('/projects/configs/names')
    getConfigsNamesOfProject(@Query() query: Record<string, any>): string[] {
        console.log("/projects/configs/names - getConfigsNamesOfProject", query)
        return this.configService.getConfigsNames(query['name']);
    }

    @Get('/projects/:projectName/configs')
    getConfigByNameFromProject(@Param('projectName') projectName: string, @Query() query: Record<string, any>): VaricityConfig {
        console.log("/projects/{" + projectName + "}/configs/{" + query["configName"] + "} - getConfigByNameFromProject");
        const config = this.configService.getConfigByNameFromProject(projectName, query["configName"]);
        console.log(config);
        return config;
    }

    @Get('/projects/configs/path')
    getConfigByPath(@Query() query: Record<string, any>): VaricityConfig {
        console.log("/projects/configs/paths/{" + query["configPath"] + "} - getConfigsFromPath");
        let config = this.configService.getConfigsFromPath(query["configPath"]);
        console.log(config);
        return config;
    }

    @Get('/projects/configs')
    getConfigsOfProject(@Query() query: Record<string, any>): VaricityConfig[] {
        console.log("/projects/configs - getConfigsOfProject", query)
        return this.configService.getConfigsFromProjectName(query['name']);
    }

    @Get('/projects/configs/firstOrDefault')
    getFirstOrDefaultConfigProject(@Query() query: Record<string, any>): VaricityConfig {
        console.log("/projects/configs/firstOrDefault - getFirstOrDefaultConfigProject", query)
        let config = this.configService.getFirstProjectConfigOrDefaultOne(query['name']);
        console.log(config);
        return config;
    }
}
