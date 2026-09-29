import { Module } from '@nestjs/common';
import { EnvoyerNotificationUseCase } from './envoyer-notification.use-case.js';
import { ConsoleMailer } from './infra/console-mailer.js';
import { NotificationHandlers } from './notification.handlers.js';

@Module({
  providers: [
    ConsoleMailer,
    EnvoyerNotificationUseCase,
    NotificationHandlers,
  ],
})
export class NotificationModule {}
