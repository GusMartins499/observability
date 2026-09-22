import './tracer';
import { NestFactory } from '@nestjs/core';
import { Logger, PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  const pinoLogger = await app.resolve(PinoLogger);
  pinoLogger.info(
    { port, env: process.env.NODE_ENV ?? 'development' },
    'aplicação 1 subiu',
  );
}

bootstrap().catch((err) => {
  console.error('erro ao subir a aplicação', err);
  process.exit(1);
});
