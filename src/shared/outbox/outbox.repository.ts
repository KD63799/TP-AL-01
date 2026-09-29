import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { PG_POOL } from '../database/database.module.js';
import type { DomainEvent } from '../events/domain-event.js';

export interface MessageOutbox {
  id: string;
  type: string;
  payload: unknown;
}

@Injectable()
export class OutboxRepository {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  // Appelé DANS la transaction métier : l'événement est enregistré si et seulement si
  // la modification métier est validée.
  async ajouter(client: pg.PoolClient, evenement: DomainEvent): Promise<void> {
    await client.query('INSERT INTO outbox (id, type, payload) VALUES ($1, $2, $3)', [
      randomUUID(),
      evenement.type,
      JSON.stringify(evenement),
    ]);
  }

  async nonPublies(limite: number): Promise<MessageOutbox[]> {
    const { rows } = await this.pool.query(
      'SELECT id, type, payload FROM outbox WHERE publie_le IS NULL ORDER BY cree_le LIMIT $1',
      [limite],
    );
    return rows;
  }

  async marquerPublie(id: string): Promise<void> {
    await this.pool.query('UPDATE outbox SET publie_le = now() WHERE id = $1', [id]);
  }
}
