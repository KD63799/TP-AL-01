import { randomUUID } from 'node:crypto';
import type { DomainEvent } from '../../shared/events/domain-event.js';
import { Creneau } from './creneau.js';
import { ReservationAnnulee, ReservationCreee, ReservationPayee } from './evenements.js';

export type StatutReservation = 'EN_ATTENTE_PAIEMENT' | 'PAYEE' | 'ANNULEE';

export const PRIX_UNITAIRE = 20;

// Agrégat Réservation : seul point d'entrée pour modifier une réservation.
// Il protège ses invariants et accumule les événements de domaine à publier.
export class Reservation {
  private evenements: DomainEvent[] = [];

  private constructor(
    readonly id: string,
    readonly ressourceId: string,
    readonly client: string,
    readonly creneau: Creneau,
    readonly quantite: number,
    readonly montant: number,
    private _statut: StatutReservation,
    private _transactionPaiement?: string,
  ) {}

  // Invariant : la quantité demandée ne dépasse jamais la capacité restante.
  static creer(params: {
    ressourceId: string;
    client: string;
    creneau: Creneau;
    quantite: number;
    capaciteRestante: number;
  }): Reservation {
    if (params.quantite <= 0) throw new Error('La quantité doit être positive');
    if (params.quantite > params.capaciteRestante) {
      throw new Error(`Capacité insuffisante : ${params.capaciteRestante} disponible(s)`);
    }
    const reservation = new Reservation(
      randomUUID(),
      params.ressourceId,
      params.client,
      params.creneau,
      params.quantite,
      params.quantite * PRIX_UNITAIRE,
      'EN_ATTENTE_PAIEMENT',
    );
    reservation.evenements.push(
      new ReservationCreee(
        reservation.id,
        reservation.ressourceId,
        reservation.client,
        reservation.creneau.debut,
        reservation.creneau.fin,
        reservation.quantite,
        reservation.montant,
      ),
    );
    return reservation;
  }

  static reconstituer(etat: {
    id: string;
    ressourceId: string;
    client: string;
    creneau: Creneau;
    quantite: number;
    montant: number;
    statut: StatutReservation;
    transactionPaiement?: string;
  }): Reservation {
    return new Reservation(
      etat.id,
      etat.ressourceId,
      etat.client,
      etat.creneau,
      etat.quantite,
      etat.montant,
      etat.statut,
      etat.transactionPaiement,
    );
  }

  get statut(): StatutReservation {
    return this._statut;
  }

  get transactionPaiement(): string | undefined {
    return this._transactionPaiement;
  }

  marquerPayee(transactionId: string): void {
    if (this._statut !== 'EN_ATTENTE_PAIEMENT') {
      throw new Error(`Impossible de payer une réservation ${this._statut}`);
    }
    this._statut = 'PAYEE';
    this._transactionPaiement = transactionId;
    this.evenements.push(new ReservationPayee(this.id, this.ressourceId, this.client, transactionId, this.montant));
  }

  annuler(remboursementId?: string): void {
    if (this._statut === 'ANNULEE') throw new Error('Réservation déjà annulée');
    this._statut = 'ANNULEE';
    this.evenements.push(
      new ReservationAnnulee(
        this.id,
        this.ressourceId,
        this.client,
        this.creneau.debut,
        this.creneau.fin,
        this.quantite,
        remboursementId,
      ),
    );
  }

  // Renvoie les événements produits depuis le dernier appel et vide la liste.
  retirerEvenements(): DomainEvent[] {
    const evenements = this.evenements;
    this.evenements = [];
    return evenements;
  }
}
