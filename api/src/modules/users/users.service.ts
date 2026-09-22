import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export interface User {
  name: string;
  email: string;
}

const USERS_ENDPOINT = 'http://api-2:3002/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectPinoLogger(UsersService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findAll(): Promise<User[]> {
    const startedAt = Date.now();

    this.logger.info(
      { endpoint: USERS_ENDPOINT },
      'chamando api-2 para buscar usuários',
    );

    try {
      const response = await fetch(USERS_ENDPOINT);

      if (!response.ok) {
        this.logger.error(
          {
            endpoint: USERS_ENDPOINT,
            status: response.status,
            elapsed: Date.now() - startedAt,
          },
          'api-2 respondeu com status de erro',
        );

        throw new Error(`api-2 respondeu ${response.status}`);
      }

      const users = (await response.json()) as User[];

      this.logger.info(
        {
          endpoint: USERS_ENDPOINT,
          status: response.status,
          total: users.length,
          elapsed: Date.now() - startedAt,
        },
        'usuários recebidos da api-2',
      );

      return users;
    } catch (error: unknown) {
      this.logger.error(
        {
          err: error,
          endpoint: USERS_ENDPOINT,
          elapsed: Date.now() - startedAt,
        },
        'falha ao chamar a api-2',
      );

      throw error;
    }
  }
}
