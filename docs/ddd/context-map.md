# Context map (gabarit générique)

Relations **constatées dans le starter**, pas forcément souhaitables. U = amont (upstream), D = aval (downstream).

```mermaid
flowchart LR
  catalogue["Catalogue"]
  reservation["Réservation"]
  paiement["Paiement"]
  notification["Notification"]
  psp["PSP (externe)"]

  catalogue ---|"Shared Kernel : base de données partagée (table ressource)"| reservation
  reservation -->|"Customer / Supplier (U : Paiement, D : Réservation)"| paiement
  paiement -->|"Conformist (U : PSP, D : Paiement)"| psp
  reservation -.->|"Published Language : événements (U : Réservation, D : Notification)"| notification
```

Relations possibles : Partnership, Shared Kernel, Customer / Supplier, Conformist, Anticorruption Layer (ACL), Open Host Service, Published Language.
