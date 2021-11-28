import {Module} from '@nestjs/common';
import {ProjectController} from "./controller/project.controller";
import {ConfigController} from "./controller/config.controller";
import {ProjectService} from "./service/project.service";
import {ConfigService} from "./service/config.service";
import {UtilsService} from "./service/utils.service";
import {FsWatcherService} from "./service/fs-watcher.service";

@Module({
    imports: [],
    controllers: [
        ProjectController,
        ConfigController
    ],
    providers: [
        ProjectService,
        ConfigService,
        UtilsService,
        FsWatcherService
    ],
})
export class AppModule {
}
