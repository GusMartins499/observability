import { Injectable } from '@nestjs/common';
import { metrics } from './tracer';

@Injectable()
export class AppService {
  getHello(): string {
    const metric = metrics.getMeter('api-service');
    const successMetric = metric.createCounter('hello_success');
    successMetric.add(1);
    return 'Hello World!';
  }

  getHistogram() {
    const metric = metrics.getMeter('api-service');
    const errorMetric = metric.createCounter('hello_error');
    errorMetric.add(1);
    const histogram = metric.createHistogram('request_duration');
    histogram.record(1000);
    return 'métrica adicionada';
  }
}
