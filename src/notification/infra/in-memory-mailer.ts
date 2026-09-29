import type { Courriel } from '../courriel.js';

// Adapter in-memory utilisé pour la démonstration du formateur en S4.
export class InMemoryMailer {
  readonly envoyes: Courriel[] = [];

  async envoyer(courriel: Courriel): Promise<void> {
    this.envoyes.push(courriel);
  }
}
