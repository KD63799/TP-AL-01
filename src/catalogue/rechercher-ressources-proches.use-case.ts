import { Injectable } from '@nestjs/common';
import { GeolocalisationClient } from './infra/geolocalisation.client.js';
import type { Position, RessourceProche } from './ressource.js';

@Injectable()
export class RechercherRessourcesProchesUseCase {
  constructor(private readonly geolocalisation: GeolocalisationClient) {}

  // Renvoie les ressources dans le rayon, de la plus proche à la plus éloignée.
  async executer(position: Position, rayonKm = 5): Promise<RessourceProche[]> {
    const proches = await this.geolocalisation.ressourcesProches(position, rayonKm);
    return [...proches].sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
