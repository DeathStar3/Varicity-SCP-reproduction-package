import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as bodyParser from 'body-parser';

async function startServer() {

    
    if (!process.env.PERSISTENT_DIR) {
        process.env.PERSISTENT_DIR = './persistent/';
    }


    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.enableCors();


    await app.listen(process.env.PORT || 3000);
}

const run = async () => {

    //Start server
    await startServer();
    //Start file system watcher
    //await new FsWatcherService().instantiateWatcher();

}
run().catch(console.error)
