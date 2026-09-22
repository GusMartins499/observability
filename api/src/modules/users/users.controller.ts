import { Controller, Get } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectPinoLogger(UsersController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    this.logger.info({ endpoint: '/users' }, 'requisição recebida em /users');

    const users = await this.usersService.findAll();

    this.logger.info(
      { endpoint: '/users', total: users.length },
      'respondendo /users com dados da api-2',
    );

    return users;
  }
}
