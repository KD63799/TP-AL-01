import type { Paiement, Remboursement } from '../paiement.js';

// Adapter in-memory fourni pour le TP S4 (variantes salles municipales et équipements sportifs).
export class InMemoryPsp {
  readonly paiements: Paiement[] = [];
  readonly remboursements: Remboursement[] = [];

  async payer(_reference: string, montant: number): Promise<Paiement> {
    const paiement = { transactionId: `tx-${this.paiements.length + 1}`, montant };
    this.paiements.push(paiement);
    return paiement;
  }

  async rembourser(transactionId: string, montant: number): Promise<Remboursement> {
    const remboursement = {
      remboursementId: `rb-${this.remboursements.length + 1}`,
      transactionId,
      montant,
    };
    this.remboursements.push(remboursement);
    return remboursement;
  }
}
