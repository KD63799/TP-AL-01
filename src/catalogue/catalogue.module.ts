import { Module } from '@nestjs/common';
import { CatalogueController } from './catalogue.controller.js';
import { GeolocalisationClient } from './infra/geolocalisation.client.js';
import { PgRessourcesRepository } from './infra/pg-ressources.repository.js';
import { ListerRessourcesUseCase } from './lister-ressources.use-case.js';
import { RechercherRessourcesProchesUseCase } from './rechercher-ressources-proches.use-case.js';

@Module({
  controllers: [CatalogueController],
  providers: [
    PgRessourcesRepository,
    GeolocalisationClient,
    ListerRessourcesUseCase,
    RechercherRessourcesProchesUseCase,
  ],
})
export class CatalogueModule {}
