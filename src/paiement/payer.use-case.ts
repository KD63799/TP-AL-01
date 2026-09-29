import { Injectable } from '@nestjs/common';
import { PspClient } from './infra/psp.client.js';
import type { Paiement } from './paiement.js';

@Injectable()
export class PayerUseCase {
  constructor(private readonly psp: PspClient) {}

  async executer(reference: string, montant: number): Promise<Paiement> {
    if (montant <= 0) throw new Error('Le montant doit être positif');
    return this.psp.payer(reference, montant);
  }
}
