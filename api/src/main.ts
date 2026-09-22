import './tracer';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(
    { port, env: process.env.NODE_ENV ?? 'development' },
    'aplicação subiu',
  );
}

bootstrap().catch((err) => {
  console.error('erro ao subir a aplicação', err);
  process.exit(1);
});
