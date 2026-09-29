// TP S4, variante matériel hospitalier. Ce test échoue tant que HistoriqueRessourceUseCase
// dépend directement de PgJournalAudit au lieu d'un port injecté par le token JOURNAL_AUDIT.
import { Test } from '@nestjs/testing';
import { HistoriqueRessourceUseCase } from '../../src/reservation/historique-ressource.use-case.js';
import { InMemoryJournalAudit } from '../../src/reservation/infra/in-memory-journal-audit.js';
import { JOURNAL_AUDIT } from '../../src/reservation/ports/tokens.js';

describe('S4 hôpital : HistoriqueRessourceUseCase derrière un port', () => {
  it("renvoie l'historique d'un équipement, du plus récent au plus ancien", async () => {
    const module = await Test.createTestingModule({
      providers: [HistoriqueRessourceUseCase, { provide: JOURNAL_AUDIT, useClass: InMemoryJournalAudit }],
    }).compile();
    const useCase = module.get(HistoriqueRessourceUseCase);

    const historique = await useCase.executer('echo-1');

    expect(historique.map((e) => e.action)).toEqual(['RESTITUTION', 'AFFECTATION']);
  });
});
