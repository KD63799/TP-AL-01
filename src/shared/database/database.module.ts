import { Global, Inject, Injectable, Module, OnApplicationShutdown } from '@nestjs/common';
import pg from 'pg';

export const PG_POOL = Symbol('PG_POOL');

// Exécute une fonction dans une transaction PostgreSQL (commit si tout passe, rollback sinon).
@Injectable()
export class Transactions {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async executer<T>(travail: (client: pg.PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const resultat = await travail(client);
      await client.query('COMMIT');
      return resultat;
    } catch (erreur) {
      await client.query('ROLLBACK');
      throw erreur;
    } finally {
      client.release();
    }
  }
}

@Injectable()
class FermeturePool implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () =>
        new pg.Pool({
          connectionString:
            process.env.DATABASE_URL ?? 'postgres://archi:archi@localhost:5432/reservation',
        }),
    },
    Transactions,
    FermeturePool,
  ],
  exports: [PG_POOL, Transactions],
})
export class DatabaseModule {}
