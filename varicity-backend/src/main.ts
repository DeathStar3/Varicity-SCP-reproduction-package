import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {fsWatcherService, FsWatcherService} from "./service/fs-watcher.service";

async function startServer() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3000);
}

const run = async () => {

    //Start server
    await startServer();
    //Start file system watcher
    await fsWatcherService.instantiateWatcher();

}
run().catch(console.error)