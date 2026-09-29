import { Injectable } from '@nestjs/common';
import { PgRessourcesRepository } from './infra/pg-ressources.repository.js';
import type { Ressource } from './ressource.js';

@Injectable()
export class ListerRessourcesUseCase {
  constructor(private readonly ressources: PgRessourcesRepository) {}

  async executer(site?: string): Promise<Ressource[]> {
    return this.ressources.lister(site);
  }
}
