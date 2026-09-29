// TP S4, variante équipements sportifs. Ce test échoue tant que RembourserUseCase
// dépend directement de PspClient au lieu d'un port injecté par le token PRESTATAIRE_PAIEMENT.
import { Test } from '@nestjs/testing';
import { InMemoryPsp } from '../../src/paiement/infra/in-memory-psp.js';
import { PRESTATAIRE_PAIEMENT } from '../../src/paiement/ports/tokens.js';
import { RembourserUseCase } from '../../src/paiement/rembourser.use-case.js';

describe('S4 équipements sportifs : RembourserUseCase derrière un port', () => {
  it('rembourse le montant diminué de la pénalité', async () => {
    const module = await Test.createTestingModule({
      providers: [RembourserUseCase, { provide: PRESTATAIRE_PAIEMENT, useClass: InMemoryPsp }],
    }).compile();
    const useCase = module.get(RembourserUseCase);
    const psp = module.get<InMemoryPsp>(PRESTATAIRE_PAIEMENT);

    const remboursement = await useCase.executer('tx-42', 40, 25);

    expect(remboursement).toEqual({ remboursementId: 'rb-1', transactionId: 'tx-42', montant: 30 });
    expect(psp.remboursements).toHaveLength(1);
  });
});
