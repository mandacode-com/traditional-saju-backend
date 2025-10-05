import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/config.schema';
import { HttpExceptionFilter } from './filters/http_exception.filter';
import { PrismaExceptionFilter } from './filters/prisma_exception.filter';
import { ZodExceptionFilter } from './filters/zod_exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService<Config, true>);

  app.enableCors();

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // Implement global exception filter
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
    new ZodExceptionFilter(),
  );

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Traditional Saju API')
    .setDescription('Traditional Saju fortune-telling API service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });

  await app.listen(config.get<Config['server']>('server').port);
}
bootstrap().catch(console.error);
