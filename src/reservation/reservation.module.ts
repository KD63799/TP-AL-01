import { Module } from '@nestjs/common';
import { PaiementModule } from '../paiement/paiement.module.js';
import { AnnulerReservationUseCase } from './annuler-reservation.use-case.js';
import { ConsulterCapaciteUseCase } from './consulter-capacite.use-case.js';
import { CreerReservationUseCase } from './creer-reservation.use-case.js';
import { HistoriqueRessourceUseCase } from './historique-ressource.use-case.js';
import { PgCapacites } from './infra/pg-capacites.repository.js';
import { PgJournalAudit } from './infra/pg-journal-audit.js';
import { PgReservationsRepository } from './infra/pg-reservations.repository.js';
import { PayerReservationUseCase } from './payer-reservation.use-case.js';
import { ReservationController } from './reservation.controller.js';

@Module({
  imports: [PaiementModule],
  controllers: [ReservationController],
  providers: [
    PgReservationsRepository,
    PgCapacites,
    PgJournalAudit,
    CreerReservationUseCase,
    PayerReservationUseCase,
    AnnulerReservationUseCase,
    ConsulterCapaciteUseCase,
    HistoriqueRessourceUseCase,
  ],
})
export class ReservationModule {}
