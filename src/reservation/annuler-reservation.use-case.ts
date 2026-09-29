import { Injectable, NotFoundException } from '@nestjs/common';
import { RembourserUseCase } from '../paiement/rembourser.use-case.js';
import { Transactions } from '../shared/database/database.module.js';
import { EventBus } from '../shared/events/event-bus.js';
import { OutboxRepository } from '../shared/outbox/outbox.repository.js';
import type { Reservation } from './domain/reservation.js';
import { PgReservationsRepository } from './infra/pg-reservations.repository.js';

// Annule une réservation et, si elle était payée, la rembourse intégralement.
@Injectable()
export class AnnulerReservationUseCase {
  constructor(
    private readonly transactions: Transactions,
    private readonly reservations: PgReservationsRepository,
    private readonly rembourser: RembourserUseCase,
    private readonly outbox: OutboxRepository,
    private readonly bus: EventBus,
  ) {}

  async executer(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservations.parId(reservationId);
    if (!reservation) throw new NotFoundException(`Réservation inconnue : ${reservationId}`);

    let remboursementId: string | undefined;
    if (reservation.statut === 'PAYEE' && reservation.transactionPaiement) {
      const remboursement = await this.rembourser.executer(reservation.transactionPaiement, reservation.montant);
      remboursementId = remboursement.remboursementId;
    }
    reservation.annuler(remboursementId);
    const evenements = reservation.retirerEvenements();

    await this.transactions.executer(async (client) => {
      await this.reservations.sauvegarder(client, reservation);
      for (const evenement of evenements) await this.outbox.ajouter(client, evenement);
    });
    for (const evenement of evenements) await this.bus.publier(evenement);
    return reservation;
  }
}
