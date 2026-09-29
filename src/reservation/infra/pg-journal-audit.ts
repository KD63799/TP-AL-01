import { Inject, Injectable } from '@nestjs/common';
import pg from 'pg';
import { PG_POOL } from '../../shared/database/database.module.js';
import type { EntreeJournal } from '../entree-journal.js';

@Injectable()
export class PgJournalAudit {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async tracer(client: pg.PoolClient, ressourceId: string, action: string, auteur: string): Promise<void> {
    await client.query('INSERT INTO journal_audit (ressource_id, action, auteur) VALUES ($1, $2, $3)', [
      ressourceId,
      action,
      auteur,
    ]);
  }

  async historique(ressourceId: string): Promise<EntreeJournal[]> {
    const { rows } = await this.pool.query(
      `SELECT ressource_id AS "ressourceId", action, auteur, horodatage
       FROM journal_audit WHERE ressource_id = $1 ORDER BY horodatage, id`,
      [ressourceId],
    );
    return rows;
  }
}
