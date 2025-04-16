import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './schemas/config.schema';
import { HttpExceptionFilter } from './filters/http_exception.filter';
import { PrismaExceptionFilter } from './filters/prisma_exception.filter';
import { ZodExceptionFilter } from './filters/zod_exception.filter';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Config, true>);

  // app kafka transporter
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.get('kafka', { infer: true }).app.client.clientId,
        brokers: config.get('kafka', { infer: true }).app.client.brokers,
      },
      consumer: {
        groupId: config.get('kafka', { infer: true }).app.consumer.groupId,
      },
    },
  });

  // LOGGER [NOT IMPLEMENTED]
  // logger kafka transporter
  //app.connectMicroservice({
  //  transport: Transport.KAFKA,
  //  options: {
  //    client: {
  //      brokers: [config.get<Config['kafka']>('kafka').logger.broker],
  //    },
  //  },
  //});

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(config.get<Config['server']>('server').port);

  // Implement global exception filter
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
    new ZodExceptionFilter(),
  );
}
bootstrap().catch(console.error);
