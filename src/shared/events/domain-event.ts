// Tout événement de domaine a un type (nom au passé) et une date.
export interface DomainEvent {
  readonly type: string;
  readonly survenuLe: Date;
}
