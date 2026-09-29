import { Inject, Injectable } from '@nestjs/common';
import pg from 'pg';
import { PG_POOL } from '../../shared/database/database.module.js';
import type { Ressource } from '../ressource.js';

@Injectable()
export class PgRessourcesRepository {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async lister(site?: string): Promise<Ressource[]> {
    const { rows } = await this.pool.query(
      `SELECT id, nom, categorie, site, capacite FROM ressource
       WHERE $1::text IS NULL OR site = $1 ORDER BY id`,
      [site ?? null],
    );
    return rows;
  }
}
