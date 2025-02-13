import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './schemas/config.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const config = app.get(ConfigService<Config, true>);

  await app.listen(config.get<Config['server']>('server').port);
}
bootstrap().catch(console.error);
