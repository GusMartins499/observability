import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { metrics } from './tracer';

@Injectable()
export class AppService {
  constructor(
    @InjectPinoLogger(AppService.name)
    private readonly logger: PinoLogger,
  ) {}

  getHello(): string {
    this.logger.debug({ handler: 'getHello' }, 'iniciando handler do hello');

    const metric = metrics.getMeter('api-service');
    const successMetric = metric.createCounter('hello_success');
    successMetric.add(1);

    this.logger.info(
      { metric: 'hello_success', increment: 1 },
      'contador hello_success incrementado',
    );

    return 'Hello World!';
  }

  getHistogram() {
    const startedAt = Date.now();
    this.logger.debug({ handler: 'getHistogram' }, 'registrando histograma');

    const metric = metrics.getMeter('api-service');
    const errorMetric = metric.createCounter('hello_error');
    errorMetric.add(1);

    const duration = 1000;
    const histogram = metric.createHistogram('request_duration');
    histogram.record(duration);

    this.logger.warn(
      { metric: 'hello_error', duration, elapsed: Date.now() - startedAt },
      'contador hello_error incrementado e duração registrada',
    );

    return 'métrica adicionada';
  }

  getError(): never {
    const error = new Error('falha simulada para gerar log de erro');

    this.logger.error(
      { err: error, handler: 'getError' },
      'erro ao processar a requisição',
    );

    throw error;
  }
}
