import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function startServer() {
  if (!process.env.PERSISTENT_DIR) {
    process.env.PERSISTENT_DIR = './persistent/';
  }

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Varicity')
    .setDescription('The Varicity API description')
    .setVersion('1.0')
    .addTag('varicity')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}

const run = async () => {
  //Start server
  await startServer();
};
run().catch(console.error);
