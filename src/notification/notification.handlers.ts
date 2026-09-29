import { Injectable, OnModuleInit } from '@nestjs/common';
import { ReservationCreee } from '../reservation/domain/evenements.js';
import { EventBus } from '../shared/events/event-bus.js';
import { EnvoyerNotificationUseCase } from './envoyer-notification.use-case.js';

// Exemple d'abonnement à un événement de domaine sur le bus in-process.
@Injectable()
export class NotificationHandlers implements OnModuleInit {
  constructor(
    private readonly bus: EventBus,
    private readonly envoyerNotification: EnvoyerNotificationUseCase,
  ) {}

  onModuleInit(): void {
    this.bus.abonner<ReservationCreee>(ReservationCreee.TYPE, (evenement) =>
      this.envoyerNotification.executer(
        evenement.client,
        `Réservation ${evenement.reservationId} enregistrée (${evenement.montant} €)`,
      ),
    );
  }
}
