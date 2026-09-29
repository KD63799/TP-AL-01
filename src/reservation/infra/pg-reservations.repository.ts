import { Inject, Injectable } from '@nestjs/common';
import pg from 'pg';
import { PG_POOL } from '../../shared/database/database.module.js';
import { Creneau } from '../domain/creneau.js';
import { Reservation } from '../domain/reservation.js';

@Injectable()
export class PgReservationsRepository {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async parId(id: string): Promise<Reservation | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM reservation WHERE id = $1', [id]);
    const ligne = rows[0];
    if (!ligne) return undefined;
    return Reservation.reconstituer({
      id: ligne.id,
      ressourceId: ligne.ressource_id,
      client: ligne.client,
      creneau: Creneau.creer(ligne.debut, ligne.fin),
      quantite: ligne.quantite,
      montant: Number(ligne.montant),
      statut: ligne.statut,
      transactionPaiement: ligne.transaction_paiement ?? undefined,
    });
  }

  // À appeler dans une transaction (client fourni par Transactions).
  async sauvegarder(client: pg.PoolClient, r: Reservation): Promise<void> {
    await client.query(
      `INSERT INTO reservation (id, ressource_id, client, debut, fin, quantite, montant, statut, transaction_paiement)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET statut = EXCLUDED.statut, transaction_paiement = EXCLUDED.transaction_paiement`,
      [r.id, r.ressourceId, r.client, r.creneau.debut, r.creneau.fin, r.quantite, r.montant, r.statut, r.transactionPaiement ?? null],
    );
  }
}
