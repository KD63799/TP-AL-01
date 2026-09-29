// TP S4, variante autopartage. Ce test échoue tant que RechercherRessourcesProchesUseCase
// dépend directement de GeolocalisationClient au lieu d'un port injecté par le token GEOLOCALISATION.
import { Test } from '@nestjs/testing';
import { InMemoryGeolocalisation } from '../../src/catalogue/infra/in-memory-geolocalisation.js';
import { GEOLOCALISATION } from '../../src/catalogue/ports/tokens.js';
import { RechercherRessourcesProchesUseCase } from '../../src/catalogue/rechercher-ressources-proches.use-case.js';

describe('S4 autopartage : RechercherRessourcesProchesUseCase derrière un port', () => {
  it('renvoie les véhicules dans le rayon, du plus proche au plus éloigné', async () => {
    const module = await Test.createTestingModule({
      providers: [RechercherRessourcesProchesUseCase, { provide: GEOLOCALISATION, useClass: InMemoryGeolocalisation }],
    }).compile();
    const useCase = module.get(RechercherRessourcesProchesUseCase);

    const proches = await useCase.executer({ latitude: 43.52, longitude: 5.44 }, 5);

    expect(proches.map((p) => p.ressourceId)).toEqual(['v-1', 'v-2']);
  });
});
