import { Injectable, Logger } from '@nestjs/common';
import type { Courriel } from '../courriel.js';

// Simule un serveur SMTP : le courriel est affiché dans la console.
@Injectable()
export class ConsoleMailer {
  private readonly logger = new Logger('Mailer');

  async envoyer(courriel: Courriel): Promise<void> {
    this.logger.log(`À ${courriel.destinataire} : ${courriel.sujet}`);
  }
}
