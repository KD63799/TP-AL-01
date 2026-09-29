import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Paiement, Remboursement } from '../paiement.js';

// Simule un prestataire de paiement externe (PSP) : latence réseau et échecs aléatoires.
// PSP_TAUX_ECHEC=0.3 fait échouer 30 % des appels (utile pour illustrer une panne externe, et pour le module Microservices).
@Injectable()
export class PspClient {
  async payer(reference: string, montant: number): Promise<Paiement> {
    await this.appelReseau(`paiement ${reference}`);
    return { transactionId: `tx-${randomUUID()}`, montant };
  }

  async rembourser(transactionId: string, montant: number): Promise<Remboursement> {
    await this.appelReseau(`remboursement ${transactionId}`);
    return { remboursementId: `rb-${randomUUID()}`, transactionId, montant };
  }

  private async appelReseau(operation: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (Math.random() < Number(process.env.PSP_TAUX_ECHEC ?? 0)) {
      throw new Error(`PSP indisponible (${operation})`);
    }
  }
}
