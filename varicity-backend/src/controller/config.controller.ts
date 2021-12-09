import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VaricityConfigService } from '../service/config.service';
import { VaricityConfig } from '../model/config.model';
import { ConfigEntry } from 'src/model/experiment.model';

@Controller()
export class ConfigController {
  constructor(private readonly configService: VaricityConfigService) { }

  @Post('/projects/configs')
  saveConfig(@Body() config: VaricityConfig): any {
    console.log('/projects/configs - saveConfig, ');
    return this.configService.saveConfig(config);
  }

  @Post('/projects/configs/:configFile')
  updateConfig(@Param('configFile') configFile: string, @Body() config: VaricityConfig,): any {
    console.log('/projects/configs/' + configFile + ' - updateConfig, ', config);
    return this.configService.updateConfig(configFile, config);
  }

  @Get('/projects/configs/names')
  getConfigsFilenamesOfProject(@Query() query: Record<string, any>): string[] {
    console.log('/projects/configs/names - getConfigsNamesOfProject', query);
    return this.configService.getConfigsFilesNames(query['name']);
  }

  @Get('/projects/:projectName/configs')
  getConfigByNameFromProject(@Param('projectName') projectName: string, @Query() query: Record<string, any>,): VaricityConfig {
    console.log(`/projects/${projectName}/configs/${query['configName']} - getConfigByNameFromProject`);
    const config = this.configService.getConfigByNameFromProject(
      projectName,
      query['configName'],
    );
    console.log(config);
    return config;
  }

  @Get('/projects/configs/path')
  getConfigByPath(@Query() query: Record<string, any>): VaricityConfig {
    console.log('/projects/configs/paths/{' + query['configPath'] + '} - getConfigsFromPath');
    const config = this.configService.getConfigsFromPath(query['configPath']);
    return config;
  }

  @Get('/projects/configs')
  getConfigsOfProject(@Query() query: Record<string, any>): VaricityConfig[] {
    console.log('/projects/configs - getConfigsOfProject', query);
    return this.configService.getConfigsFromProjectName(query['name']);
  }

  @Get('/projects/configs/firstOrDefault')
  getFirstOrDefaultConfigProject(@Query() query: Record<string, any>,): VaricityConfig {
    console.log('/projects/configs/firstOrDefault - getFirstOrDefaultConfigProject', query);
    return this.configService.getFirstProjectConfigOrDefaultOne(query['name']);
  }

  @Get('/projects/:projectName/configs/filenames-and-names')
  getConfigsNamesOfProject(@Param('projectName') projectName: string,): ConfigEntry[] {
    console.log(`/projects/${projectName}/configs/filenames-and-names - getConfigsNamesAndFileNames`);
    return this.configService.getConfigsNamesAndFileNames(projectName);
  }
}