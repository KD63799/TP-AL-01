import { Injectable } from '@nestjs/common';
import { Transactions } from '../shared/database/database.module.js';
import { EventBus } from '../shared/events/event-bus.js';
import { OutboxRepository } from '../shared/outbox/outbox.repository.js';
import { Creneau } from './domain/creneau.js';
import { Reservation } from './domain/reservation.js';
import { PgCapacites } from './infra/pg-capacites.repository.js';
import { PgJournalAudit } from './infra/pg-journal-audit.js';
import { PgReservationsRepository } from './infra/pg-reservations.repository.js';

export interface DemandeReservation {
  ressourceId: string;
  client: string;
  debut: Date;
  fin: Date;
  quantite: number;
}

@Injectable()
export class CreerReservationUseCase {
  constructor(
    private readonly transactions: Transactions,
    private readonly reservations: PgReservationsRepository,
    private readonly capacites: PgCapacites,
    private readonly journal: PgJournalAudit,
    private readonly outbox: OutboxRepository,
    private readonly bus: EventBus,
  ) {}

  async executer(demande: DemandeReservation): Promise<Reservation> {
    const creneau = Creneau.creer(demande.debut, demande.fin);
    // Attention : la capacité est lue AVANT la transaction. Deux demandes simultanées
    // peuvent donc toutes deux la voir disponible (voir S5 et S6).
    const capaciteRestante = await this.capacites.capaciteRestante(demande.ressourceId, creneau);
    const reservation = Reservation.creer({ ...demande, creneau, capaciteRestante });
    const evenements = reservation.retirerEvenements();

    await this.transactions.executer(async (client) => {
      await this.reservations.sauvegarder(client, reservation);
      await this.journal.tracer(client, reservation.ressourceId, 'RESERVATION', reservation.client);
      for (const evenement of evenements) await this.outbox.ajouter(client, evenement);
    });

    // Après le commit : diffusion in-process aux autres modules.
    for (const evenement of evenements) await this.bus.publier(evenement);
    return reservation;
  }
}
