import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './schemas/config.schema';
import { HttpExceptionFilter } from './filters/http_exception.filter';
import { PrismaExceptionFilter } from './filters/prisma_exception.filter';
import { ZodExceptionFilter } from './filters/zod_exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const config = app.get(ConfigService<Config, true>);

  await app.listen(config.get<Config['server']>('server').port);

  // Implement global exception filter
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
    new ZodExceptionFilter(),
  );
}
bootstrap().catch(console.error);
