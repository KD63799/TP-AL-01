// Tests du domaine fourni : ils doivent toujours passer.
import { Creneau } from '../../src/reservation/domain/creneau.js';
import { ReservationCreee, ReservationPayee } from '../../src/reservation/domain/evenements.js';
import { Reservation } from '../../src/reservation/domain/reservation.js';

const creneau = Creneau.creer(new Date('2026-10-05T09:00:00Z'), new Date('2026-10-05T11:00:00Z'));

describe('Creneau', () => {
  it('refuse un créneau dont le début suit la fin', () => {
    expect(() => Creneau.creer(creneau.fin, creneau.debut)).toThrow();
  });

  it('détecte un chevauchement', () => {
    const autre = Creneau.creer(new Date('2026-10-05T10:00:00Z'), new Date('2026-10-05T12:00:00Z'));
    expect(creneau.chevauche(autre)).toBe(true);
  });
});

describe('Reservation', () => {
  const demande = { ressourceId: 'r-1', client: 'alice', creneau, quantite: 2 };

  it('refuse une quantité supérieure à la capacité restante', () => {
    expect(() => Reservation.creer({ ...demande, capaciteRestante: 1 })).toThrow('Capacité insuffisante');
  });

  it('émet ReservationCreee puis ReservationPayee', () => {
    const reservation = Reservation.creer({ ...demande, capaciteRestante: 5 });
    expect(reservation.retirerEvenements()).toEqual([expect.any(ReservationCreee)]);

    reservation.marquerPayee('tx-1');
    expect(reservation.statut).toBe('PAYEE');
    expect(reservation.retirerEvenements()).toEqual([expect.any(ReservationPayee)]);
  });

  it('refuse de payer deux fois la même réservation', () => {
    const reservation = Reservation.creer({ ...demande, capaciteRestante: 5 });
    reservation.marquerPayee('tx-1');
    expect(() => reservation.marquerPayee('tx-2')).toThrow();
  });

  it('refuse de payer une réservation annulée', () => {
    const reservation = Reservation.creer({ ...demande, capaciteRestante: 5 });
    reservation.annuler();
    expect(() => reservation.marquerPayee('tx-1')).toThrow();
  });
});
