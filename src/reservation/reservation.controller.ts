import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AnnulerReservationUseCase } from './annuler-reservation.use-case.js';
import { ConsulterCapaciteUseCase } from './consulter-capacite.use-case.js';
import { CreerReservationUseCase } from './creer-reservation.use-case.js';
import type { Reservation } from './domain/reservation.js';
import { HistoriqueRessourceUseCase } from './historique-ressource.use-case.js';
import { PayerReservationUseCase } from './payer-reservation.use-case.js';

interface CorpsReservation {
  ressourceId: string;
  client: string;
  debut: string;
  fin: string;
  quantite?: number;
}

@Controller()
export class ReservationController {
  constructor(
    private readonly creer: CreerReservationUseCase,
    private readonly payer: PayerReservationUseCase,
    private readonly annuler: AnnulerReservationUseCase,
    private readonly consulterCapacite: ConsulterCapaciteUseCase,
    private readonly historique: HistoriqueRessourceUseCase,
  ) {}

  @Post('reservations')
  async creerReservation(@Body() corps: CorpsReservation) {
    try {
      const reservation = await this.creer.executer({
        ressourceId: corps.ressourceId,
        client: corps.client,
        debut: new Date(corps.debut),
        fin: new Date(corps.fin),
        quantite: corps.quantite ?? 1,
      });
      return vue(reservation);
    } catch (erreur) {
      throw new BadRequestException((erreur as Error).message);
    }
  }

  @Post('reservations/:id/paiement')
  async payerReservation(@Param('id') id: string) {
    return vue(await this.payer.executer(id));
  }

  @Post('reservations/:id/annulation')
  async annulerReservation(@Param('id') id: string) {
    return vue(await this.annuler.executer(id));
  }

  @Get('ressources/:id/capacite')
  capacite(@Param('id') id: string, @Query('debut') debut: string, @Query('fin') fin: string) {
    return this.consulterCapacite.executer(id, new Date(debut), new Date(fin));
  }

  @Get('ressources/:id/historique')
  historiqueRessource(@Param('id') id: string) {
    return this.historique.executer(id);
  }
}

function vue(r: Reservation) {
  return {
    id: r.id,
    ressourceId: r.ressourceId,
    client: r.client,
    debut: r.creneau.debut,
    fin: r.creneau.fin,
    quantite: r.quantite,
    montant: r.montant,
    statut: r.statut,
    transactionPaiement: r.transactionPaiement,
  };
}
