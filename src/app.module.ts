import { Module } from '@nestjs/common';
import { CatalogueModule } from './catalogue/catalogue.module.js';
import { NotificationModule } from './notification/notification.module.js';
import { ReservationModule } from './reservation/reservation.module.js';
import { DatabaseModule } from './shared/database/database.module.js';
import { EventsModule } from './shared/events/event-bus.js';
import { OutboxModule } from './shared/outbox/outbox.module.js';

@Module({
  imports: [DatabaseModule, EventsModule, OutboxModule, CatalogueModule, ReservationModule, NotificationModule],
})
export class AppModule {}
