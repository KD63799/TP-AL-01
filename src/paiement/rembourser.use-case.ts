import { Injectable } from '@nestjs/common';
import { PspClient } from './infra/psp.client.js';
import type { Remboursement } from './paiement.js';

@Injectable()
export class RembourserUseCase {
  constructor(private readonly psp: PspClient) {}

  // Rembourse le montant, diminué d'une pénalité éventuelle (en pourcentage).
  async executer(transactionId: string, montant: number, penalitePourcent = 0): Promise<Remboursement> {
    const aRembourser = Math.round(montant * (100 - penalitePourcent)) / 100;
    return this.psp.rembourser(transactionId, aRembourser);
  }
}
