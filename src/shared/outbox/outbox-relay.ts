import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { OutboxRepository } from './outbox.repository.js';
import { RabbitMqPublisher } from './rabbitmq.publisher.js';

// Relais de l'outbox : toutes les secondes, publie vers le broker les messages non publiés,
// dans l'ordre, puis les marque publiés. Si le broker est indisponible, les messages
// restent en base et seront repris au tour suivant (livraison « au moins une fois »).
@Injectable()
export class OutboxRelay implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(OutboxRelay.name);
  private minuteur?: NodeJS.Timeout;
  private enCours = false;

  constructor(
    private readonly outbox: OutboxRepository,
    private readonly publisher: RabbitMqPublisher,
  ) {}

  onApplicationBootstrap(): void {
    if (process.env.OUTBOX_RELAY === 'off') return;
    this.minuteur = setInterval(() => void this.relayer(), 1000);
  }

  onApplicationShutdown(): void {
    clearInterval(this.minuteur);
  }

  async relayer(): Promise<void> {
    if (this.enCours) return;
    this.enCours = true;
    try {
      for (const message of await this.outbox.nonPublies(50)) {
        await this.publisher.publier(message.type, message.payload, message.id);
        // Si le processus s'arrête ici, le message sera republié : le consommateur
        // doit donc être idempotent (étudié dans le module Microservices).
        await this.outbox.marquerPublie(message.id);
        this.logger.log(`Publié ${message.type} (${message.id})`);
      }
    } catch (erreur) {
      this.logger.warn(`Broker indisponible, nouvel essai dans 1 s : ${(erreur as Error).message}`);
    } finally {
      this.enCours = false;
    }
  }
}
