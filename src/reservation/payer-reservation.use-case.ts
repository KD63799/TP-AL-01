import { Injectable, NotFoundException } from '@nestjs/common';
import { PayerUseCase } from '../paiement/payer.use-case.js';
import { Transactions } from '../shared/database/database.module.js';
import { EventBus } from '../shared/events/event-bus.js';
import { OutboxRepository } from '../shared/outbox/outbox.repository.js';
import type { Reservation } from './domain/reservation.js';
import { PgReservationsRepository } from './infra/pg-reservations.repository.js';

// Enchaîne le paiement (appel distant au PSP) et la mise à jour de la réservation.
// Question ouverte (module Microservices) : que se passe-t-il si le processus s'arrête entre les deux ?
@Injectable()
export class PayerReservationUseCase {
  constructor(
    private readonly transactions: Transactions,
    private readonly reservations: PgReservationsRepository,
    private readonly payer: PayerUseCase,
    private readonly outbox: OutboxRepository,
    private readonly bus: EventBus,
  ) {}

  async executer(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservations.parId(reservationId);
    if (!reservation) throw new NotFoundException(`Réservation inconnue : ${reservationId}`);

    const paiement = await this.payer.executer(reservation.id, reservation.montant);
    reservation.marquerPayee(paiement.transactionId);
    const evenements = reservation.retirerEvenements();

    await this.transactions.executer(async (client) => {
      await this.reservations.sauvegarder(client, reservation);
      for (const evenement of evenements) await this.outbox.ajouter(client, evenement);
    });
    for (const evenement of evenements) await this.bus.publier(evenement);
    return reservation;
  }
}
