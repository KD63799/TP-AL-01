import { Injectable } from '@nestjs/common';
import { Creneau } from './domain/creneau.js';
import { PgCapacites } from './infra/pg-capacites.repository.js';

export interface Disponibilite {
  ressourceId: string;
  restante: number;
  complet: boolean;
}

@Injectable()
export class ConsulterCapaciteUseCase {
  constructor(private readonly capacites: PgCapacites) {}

  async executer(ressourceId: string, debut: Date, fin: Date): Promise<Disponibilite> {
    const restante = await this.capacites.capaciteRestante(ressourceId, Creneau.creer(debut, fin));
    return { ressourceId, restante, complet: restante === 0 };
  }
}
