import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {fsWatcherService} from "./service/fs-watcher.service";
import * as bodyParser from 'body-parser';

async function startServer() {
    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
