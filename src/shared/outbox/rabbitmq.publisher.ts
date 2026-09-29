import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import amqp from 'amqplib';

export const EXCHANGE = 'reservation.evenements';
export const FILE_NOTIFICATION = 'notification.reservations';

// Publie vers RabbitMQ avec accusé de réception du broker (confirm channel).
// La connexion est ouverte à la demande et réinitialisée en cas d'erreur.
@Injectable()
export class RabbitMqPublisher implements OnApplicationShutdown {
  private readonly logger = new Logger(RabbitMqPublisher.name);
  private connexion?: amqp.ChannelModel;
  private canal?: amqp.ConfirmChannel;

  async publier(type: string, message: unknown, messageId: string): Promise<void> {
    const canal = await this.obtenirCanal();
    canal.publish(EXCHANGE, type, Buffer.from(JSON.stringify(message)), {
      persistent: true,
      contentType: 'application/json',
      messageId,
    });
    await canal.waitForConfirms();
  }

  private async obtenirCanal(): Promise<amqp.ConfirmChannel> {
    if (this.canal) return this.canal;
    const connexion = await amqp.connect(process.env.AMQP_URL ?? 'amqp://guest:guest@localhost:5672');
    connexion.on('error', () => this.reinitialiser());
    connexion.on('close', () => this.reinitialiser());
    const canal = await connexion.createConfirmChannel();
    await canal.assertExchange(EXCHANGE, 'topic', { durable: true });
    // File de démonstration : elle accumule les messages pour les observer dans la console.
    await canal.assertQueue(FILE_NOTIFICATION, { durable: true });
    await canal.bindQueue(FILE_NOTIFICATION, EXCHANGE, '#');
    this.connexion = connexion;
    this.canal = canal;
    this.logger.log('Connecté à RabbitMQ');
    return canal;
  }

  private reinitialiser(): void {
    this.connexion = undefined;
    this.canal = undefined;
  }

  async onApplicationShutdown(): Promise<void> {
    await this.connexion?.close().catch(() => undefined);
  }
}
