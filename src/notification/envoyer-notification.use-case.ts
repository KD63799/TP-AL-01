import { Injectable } from '@nestjs/common';
import { ConsoleMailer } from './infra/console-mailer.js';

@Injectable()
export class EnvoyerNotificationUseCase {
  constructor(private readonly mailer: ConsoleMailer) {}

  async executer(client: string, message: string): Promise<void> {
    await this.mailer.envoyer({
      destinataire: `${client}@exemple.fr`,
      sujet: message,
      corps: `Bonjour ${client},\n\n${message}`,
    });
  }
}
