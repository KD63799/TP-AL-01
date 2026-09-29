import type { Ressource } from '../ressource.js';

// Adapter in-memory fourni pour le TP S4 (variante coworking).
export class InMemoryRessources {
  private readonly ressources: Ressource[] = [
    { id: 'm-1', nom: 'Bureau 1', categorie: 'bureau', site: 'lyon', capacite: 1 },
    { id: 'm-2', nom: 'Salle Rhône', categorie: 'salle', site: 'lyon', capacite: 8 },
    { id: 'm-3', nom: 'Salle Vieux-Port', categorie: 'salle', site: 'marseille', capacite: 10 },
  ];

  async lister(site?: string): Promise<Ressource[]> {
    return this.ressources.filter((r) => site === undefined || r.site === site);
  }
}
