export interface Paiement {
  transactionId: string;
  montant: number;
}

export interface Remboursement {
  remboursementId: string;
  transactionId: string;
  montant: number;
}
