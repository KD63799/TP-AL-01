import { Global, Injectable, Logger, Module } from '@nestjs/common';
import type { DomainEvent } from './domain-event.js';

type Handler<E extends DomainEvent> = (evenement: E) => Promise<void> | void;

// Bus d'événements in-process : synchrone, sans persistance, dans le même processus.
// Un handler en échec est journalisé mais n'interrompt pas les autres.
@Injectable()
export class EventBus {
  private readonly logger = new Logger(EventBus.name);
  private readonly handlers = new Map<string, Handler<DomainEvent>[]>();

  abonner<E extends DomainEvent>(type: string, handler: Handler<E>): void {
    const existants = this.handlers.get(type) ?? [];
    this.handlers.set(type, [...existants, handler as Handler<DomainEvent>]);
  }

  async publier(evenement: DomainEvent): Promise<void> {
    for (const handler of this.handlers.get(evenement.type) ?? []) {
      try {
        await handler(evenement);
      } catch (erreur) {
        this.logger.error(`Handler en échec pour ${evenement.type}`, erreur as Error);
      }
    }
  }
}

@Global()
@Module({ providers: [EventBus], exports: [EventBus] })
export class EventsModule {}
