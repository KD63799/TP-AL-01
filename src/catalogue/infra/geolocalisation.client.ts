import { Inject, Injectable } from '@nestjs/common';
import pg from 'pg';
import { PG_POOL } from '../../shared/database/database.module.js';
import type { Position, RessourceProche } from '../ressource.js';

// Simule un service externe de géolocalisation (latence réseau comprise).
// Dans le starter, il lit les coordonnées en base pour rester autonome.
@Injectable()
export class GeolocalisationClient {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async ressourcesProches(position: Position, rayonKm: number): Promise<RessourceProche[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const { rows } = await this.pool.query('SELECT id, latitude, longitude FROM ressource');
    return rows
      .map((r) => ({ ressourceId: r.id, distanceKm: distanceKm(position, r) }))
      .filter((r) => r.distanceKm <= rayonKm);
  }
}

function distanceKm(a: Position, b: Position): number {
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)) * 10) / 10;
}
