import { Inject, Injectable } from '@nestjs/common';
import pg from 'pg';
import { PG_POOL } from '../../shared/database/database.module.js';
import type { Creneau } from '../domain/creneau.js';

// Capacité restante d'une ressource sur un créneau : capacité totale moins les quantités
// des réservations non annulées qui chevauchent ce créneau.
@Injectable()
export class PgCapacites {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async capaciteRestante(ressourceId: string, creneau: Creneau): Promise<number> {
    const { rows } = await this.pool.query(
      `SELECT r.capacite - COALESCE(SUM(b.quantite), 0) AS restante
       FROM ressource r
       LEFT JOIN reservation b ON b.ressource_id = r.id AND b.statut <> 'ANNULEE'
         AND b.debut < $3 AND $2 < b.fin
       WHERE r.id = $1
       GROUP BY r.capacite`,
      [ressourceId, creneau.debut, creneau.fin],
    );
    if (!rows[0]) throw new Error(`Ressource inconnue : ${ressourceId}`);
    return Number(rows[0].restante);
  }
}
