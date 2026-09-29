// TP S4, variante coworking multi-sites. Ce test échoue tant que ListerRessourcesUseCase
// dépend directement de PgRessourcesRepository au lieu d'un port injecté par le token REFERENTIEL_RESSOURCES.
import { Test } from '@nestjs/testing';
import { InMemoryRessources } from '../../src/catalogue/infra/in-memory-ressources.js';
import { ListerRessourcesUseCase } from '../../src/catalogue/lister-ressources.use-case.js';
import { REFERENTIEL_RESSOURCES } from '../../src/catalogue/ports/tokens.js';

describe('S4 coworking : ListerRessourcesUseCase derrière un port', () => {
  it("liste les ressources d'un site", async () => {
    const module = await Test.createTestingModule({
      providers: [ListerRessourcesUseCase, { provide: REFERENTIEL_RESSOURCES, useClass: InMemoryRessources }],
    }).compile();
    const useCase = module.get(ListerRessourcesUseCase);

    const ressources = await useCase.executer('lyon');

    expect(ressources.map((r) => r.id)).toEqual(['m-1', 'm-2']);
  });
});
