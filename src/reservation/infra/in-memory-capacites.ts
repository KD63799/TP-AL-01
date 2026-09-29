import type { Creneau } from '../domain/creneau.js';

// Adapter in-memory fourni pour le TP S4 (variante billetterie).
export class InMemoryCapacites {
  private readonly restantes = new Map<string, number>([
    ['concert-1', 120],
    ['concert-2', 0],
  ]);

  async capaciteRestante(ressourceId: string, _creneau: Creneau): Promise<number> {
    const restante = this.restantes.get(ressourceId);
    if (restante === undefined) throw new Error(`Ressource inconnue : ${ressourceId}`);
    return restante;
  }
}
