import { Controller, Get, Query } from '@nestjs/common';
import { ListerRessourcesUseCase } from './lister-ressources.use-case.js';
import { RechercherRessourcesProchesUseCase } from './rechercher-ressources-proches.use-case.js';

@Controller('ressources')
export class CatalogueController {
  constructor(
    private readonly listerRessources: ListerRessourcesUseCase,
    private readonly rechercherProches: RechercherRessourcesProchesUseCase,
  ) {}

  @Get()
  lister(@Query('site') site?: string) {
    return this.listerRessources.executer(site);
  }

  @Get('proches')
  proches(@Query('lat') lat: string, @Query('lon') lon: string, @Query('rayonKm') rayonKm?: string) {
    return this.rechercherProches.executer(
      { latitude: Number(lat), longitude: Number(lon) },
      rayonKm ? Number(rayonKm) : undefined,
    );
  }
}
