import { Module } from '@nestjs/common';
import { ProjectController } from "./controller/project.controller";
import { ConfigController } from "./controller/config.controller";
import { ProjectService } from "./service/project.service";
import { VaricityConfigService } from "./service/config.service";
import { InitDBService } from './startup/initdb';
import { ConfigModule } from '@nestjs/config';
import { FsWatcherService } from './service/fs-watcher.service';
import { DbFacadeService } from './service/db-facade/db-facade.service';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [
        ProjectController,
        ConfigController
    ],
    providers: [
        ProjectService,
        VaricityConfigService,InitDBService, FsWatcherService, DbFacadeService
    ],
})
export class AppModule {

}
