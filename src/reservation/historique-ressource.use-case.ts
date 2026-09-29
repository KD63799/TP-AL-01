import { Injectable } from '@nestjs/common';
import type { EntreeJournal } from './entree-journal.js';
import { PgJournalAudit } from './infra/pg-journal-audit.js';

@Injectable()
export class HistoriqueRessourceUseCase {
  constructor(private readonly journal: PgJournalAudit) {}

  // Historique du plus récent au plus ancien.
  async executer(ressourceId: string): Promise<EntreeJournal[]> {
    const entrees = await this.journal.historique(ressourceId);
    return [...entrees].sort((a, b) => b.horodatage.getTime() - a.horodatage.getTime());
  }
}
