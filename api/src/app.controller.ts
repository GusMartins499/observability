import { Controller, Get } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectPinoLogger(AppController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info({ endpoint: '/' }, 'requisição recebida em /');
    return this.appService.getHello();
  }

  @Get('/histogram')
  getHistogram() {
    this.logger.info(
      { endpoint: '/histogram' },
      'requisição recebida em /histogram',
    );
    return this.appService.getHistogram();
  }

  @Get('/error')
  getError() {
    this.logger.info({ endpoint: '/error' }, 'requisição recebida em /error');
    return this.appService.getError();
  }
}
