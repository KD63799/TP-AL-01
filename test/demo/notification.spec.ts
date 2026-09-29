// Démonstration du formateur en S4 (même geste que le TP, sur un autre use case).
// Ce test échoue tant que EnvoyerNotificationUseCase dépend directement de ConsoleMailer.
import { Test } from '@nestjs/testing';
import { EnvoyerNotificationUseCase } from '../../src/notification/envoyer-notification.use-case.js';
import { InMemoryMailer } from '../../src/notification/infra/in-memory-mailer.js';
import { NOTIFIEUR } from '../../src/notification/ports/tokens.js';

describe('Démo S4 : EnvoyerNotificationUseCase derrière un port', () => {
  it('envoie un courriel au client', async () => {
    const module = await Test.createTestingModule({
      providers: [EnvoyerNotificationUseCase, { provide: NOTIFIEUR, useClass: InMemoryMailer }],
    }).compile();
    const useCase = module.get(EnvoyerNotificationUseCase);
    const mailer = module.get<InMemoryMailer>(NOTIFIEUR);

    await useCase.executer('alice', 'Réservation confirmée');

    expect(mailer.envoyes).toEqual([
      expect.objectContaining({ destinataire: 'alice@exemple.fr', sujet: 'Réservation confirmée' }),
    ]);
  });
});
