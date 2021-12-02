import { Module } from '@nestjs/common';
import { ProjectController } from "./controller/project.controller";
import { ConfigController } from "./controller/config.controller";
import { ProjectService } from "./service/project.service";
import { ConfigService } from "./service/config.service";
import { PersistenceService } from './service/persistence.service';

@Module({
    imports: [],
    controllers: [
        ProjectController,
        ConfigController
    ],
    providers: [
        ProjectService,
        ConfigService,PersistenceService
    ],
})
export class AppModule {

}
