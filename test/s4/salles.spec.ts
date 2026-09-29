// TP S4, variante salles municipales. Ce test échoue tant que PayerUseCase
// dépend directement de PspClient au lieu d'un port injecté par le token PRESTATAIRE_PAIEMENT.
import { Test } from '@nestjs/testing';
import { InMemoryPsp } from '../../src/paiement/infra/in-memory-psp.js';
import { PayerUseCase } from '../../src/paiement/payer.use-case.js';
import { PRESTATAIRE_PAIEMENT } from '../../src/paiement/ports/tokens.js';

describe('S4 salles municipales : PayerUseCase derrière un port', () => {
  it('encaisse le montant auprès du prestataire et refuse un montant nul', async () => {
    const module = await Test.createTestingModule({
      providers: [PayerUseCase, { provide: PRESTATAIRE_PAIEMENT, useClass: InMemoryPsp }],
    }).compile();
    const useCase = module.get(PayerUseCase);
    const psp = module.get<InMemoryPsp>(PRESTATAIRE_PAIEMENT);

    const paiement = await useCase.executer('resa-1', 45);

    expect(paiement).toEqual({ transactionId: 'tx-1', montant: 45 });
    expect(psp.paiements).toHaveLength(1);
    await expect(useCase.executer('resa-2', 0)).rejects.toThrow();
  });
});
