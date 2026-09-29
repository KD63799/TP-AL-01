// Vérifie que l'injection de dépendances de toute l'application se résout (aucun provider manquant).
// Ne nécessite ni base ni broker : compile() ne se connecte à rien.
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module.js';

describe("Démarrage de l'application", () => {
  it('résout toutes les dépendances de AppModule', async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    expect(module).toBeDefined();
    await module.close();
  });
});
