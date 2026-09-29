// TP S4, variante billetterie. Ce test échoue tant que ConsulterCapaciteUseCase
// dépend directement de PgCapacites au lieu d'un port injecté par le token CAPACITES.
import { Test } from '@nestjs/testing';
import { ConsulterCapaciteUseCase } from '../../src/reservation/consulter-capacite.use-case.js';
import { InMemoryCapacites } from '../../src/reservation/infra/in-memory-capacites.js';
import { CAPACITES } from '../../src/reservation/ports/tokens.js';

describe('S4 billetterie : ConsulterCapaciteUseCase derrière un port', () => {
  it('indique les places restantes et si la session est complète', async () => {
    const module = await Test.createTestingModule({
      providers: [ConsulterCapaciteUseCase, { provide: CAPACITES, useClass: InMemoryCapacites }],
    }).compile();
    const useCase = module.get(ConsulterCapaciteUseCase);
    const debut = new Date('2026-12-01T20:00:00Z');
    const fin = new Date('2026-12-01T23:00:00Z');

    expect(await useCase.executer('concert-1', debut, fin)).toEqual({ ressourceId: 'concert-1', restante: 120, complet: false });
    expect(await useCase.executer('concert-2', debut, fin)).toEqual({ ressourceId: 'concert-2', restante: 0, complet: true });
  });
});
