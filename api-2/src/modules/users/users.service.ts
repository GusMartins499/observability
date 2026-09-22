import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export interface User {
  name: string;
  email: string;
}

const USERS: User[] = [
  { name: 'Ana Souza', email: 'ana.souza@example.com' },
  { name: 'Bruno Lima', email: 'bruno.lima@example.com' },
  { name: 'Carla Dias', email: 'carla.dias@example.com' },
  { name: 'Diego Alves', email: 'diego.alves@example.com' },
];

/**
 * Atraso aleatório entre 5 e 10 ms, para simular latência de I/O.
 * Devolve os ms sorteados para poder registrar no log.
 */
function randomDelay(): Promise<number> {
  const ms = Math.floor(Math.random() * 6) + 5;
  return new Promise<number>((resolve) => setTimeout(() => resolve(ms), ms));
}

@Injectable()
export class UsersService {
  constructor(
    @InjectPinoLogger(UsersService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findAll(): Promise<User[]> {
    this.logger.debug({ handler: 'findAll' }, 'buscando lista de usuários');

    const delayMs = await randomDelay();

    this.logger.info(
      { handler: 'findAll', delayMs, total: USERS.length },
      'lista de usuários devolvida',
    );

    return USERS;
  }
}
