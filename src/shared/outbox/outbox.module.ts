import { Global, Module } from '@nestjs/common';
import { OutboxRelay } from './outbox-relay.js';
import { OutboxRepository } from './outbox.repository.js';
import { RabbitMqPublisher } from './rabbitmq.publisher.js';

@Global()
@Module({
  providers: [OutboxRepository, RabbitMqPublisher, OutboxRelay],
  exports: [OutboxRepository],
})
export class OutboxModule {}
