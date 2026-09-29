import { Module } from '@nestjs/common';
import { PspClient } from './infra/psp.client.js';
import { PayerUseCase } from './payer.use-case.js';
import { RembourserUseCase } from './rembourser.use-case.js';

@Module({
  providers: [
    PspClient,
    PayerUseCase,
    RembourserUseCase,
  ],
  exports: [PayerUseCase, RembourserUseCase],
})
export class PaiementModule {}
