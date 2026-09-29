import type { DomainEvent } from '../../shared/events/domain-event.js';

// Les événements transportent les données utiles à leurs abonnés (notification, autres modules...),
// pour qu'aucun abonné n'ait à relire la base du module Réservation.

export class ReservationCreee implements DomainEvent {
  static readonly TYPE = 'reservation.creee';
  readonly type = ReservationCreee.TYPE;
  readonly survenuLe = new Date();

  constructor(
    readonly reservationId: string,
    readonly ressourceId: string,
    readonly client: string,
    readonly debut: Date,
    readonly fin: Date,
    readonly quantite: number,
    readonly montant: number,
  ) {}
}

export class ReservationPayee implements DomainEvent {
  static readonly TYPE = 'reservation.payee';
  readonly type = ReservationPayee.TYPE;
  readonly survenuLe = new Date();

  constructor(
    readonly reservationId: string,
    readonly ressourceId: string,
    readonly client: string,
    readonly transactionId: string,
    readonly montant: number,
  ) {}
}

export class ReservationAnnulee implements DomainEvent {
  static readonly TYPE = 'reservation.annulee';
  readonly type = ReservationAnnulee.TYPE;
  readonly survenuLe = new Date();

  constructor(
    readonly reservationId: string,
    readonly ressourceId: string,
    readonly client: string,
    readonly debut: Date,
    readonly fin: Date,
    readonly quantite: number,
    readonly remboursementId?: string,
  ) {}
}
