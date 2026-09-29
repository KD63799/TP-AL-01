import type { EntreeJournal } from '../entree-journal.js';

// Adapter in-memory fourni pour le TP S4 (variante matériel hospitalier).
export class InMemoryJournalAudit {
  private readonly entrees: EntreeJournal[] = [
    { ressourceId: 'echo-1', action: 'AFFECTATION', auteur: 'cardio', horodatage: new Date('2026-10-01T08:00:00Z') },
    { ressourceId: 'echo-1', action: 'RESTITUTION', auteur: 'cardio', horodatage: new Date('2026-10-01T12:00:00Z') },
    { ressourceId: 'pompe-7', action: 'AFFECTATION', auteur: 'urgences', horodatage: new Date('2026-10-02T09:00:00Z') },
  ];

  async historique(ressourceId: string): Promise<EntreeJournal[]> {
    return this.entrees.filter((e) => e.ressourceId === ressourceId);
  }
}
