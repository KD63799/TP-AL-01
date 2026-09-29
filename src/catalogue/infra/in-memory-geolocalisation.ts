import type { Position, RessourceProche } from '../ressource.js';

// Adapter in-memory fourni pour le TP S4 (variante autopartage).
export class InMemoryGeolocalisation {
  async ressourcesProches(_position: Position, rayonKm: number): Promise<RessourceProche[]> {
    return [
      { ressourceId: 'v-2', distanceKm: 3.4 },
      { ressourceId: 'v-1', distanceKm: 0.8 },
      { ressourceId: 'v-3', distanceKm: 12 },
    ].filter((r) => r.distanceKm <= rayonKm);
  }
}
