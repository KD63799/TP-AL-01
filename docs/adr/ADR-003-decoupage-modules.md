# ADR-003 : Découpage en modules

- **Statut** : Proposé
- **Date** :
- **Variante** :
- **Séance** : S3

## Contexte

- Attribut qualité d'ADR-001 qui pèse sur le découpage :
- Ce que le découpage actuel (Catalogue, Réservation, Paiement, Notification) gère mal pour la variante :
- Dépendance actuelle ou future qui menacerait cet attribut :

## Options envisagées

1. Garder les 4 modules actuels :
2. ... (module ajouté, scindé ou fusionné) :

## Décision

Nous retenons ... parce que ...

Dépendance interdite : `src/...` ne dépend jamais de `src/...`, parce que ...

Règle correspondante dans `.dependency-cruiser.cjs` : `nom-de-la-regle`

## Conséquences

- (+)
- (-)
- Violation volontaire détectée (ligne d'erreur de `npm run depcruise`) :

## Figure

C4 niveau 3 du conteneur API, à adapter (module ajouté, scindé ou fusionné ; dépendance interdite en rouge avec `UpdateRelStyle`) :

```mermaid
C4Component
  title Composants de l'API
  ContainerDb(db, "Base", "PostgreSQL")
  ContainerQueue(broker, "Broker", "RabbitMQ")
  System_Ext(psp, "PSP", "Paiement externe")

  Container_Boundary(api, "API NestJS") {
    Component(catalogue, "Catalogue", "Module", "Liste et localise les ressources")
    Component(reservation, "Réservation", "Module", "Agrégat Réservation, capacité, journal")
    Component(paiement, "Paiement", "Module", "Paie et rembourse via le PSP")
    Component(notification, "Notification", "Module", "Prévient le client")
    Component(bus, "EventBus", "In-process", "Diffuse les événements de domaine")
    Component(outbox, "Relais outbox", "Tâche périodique", "Publie l'outbox vers le broker")
  }

  Rel(reservation, paiement, "Appelle")
  Rel(reservation, bus, "Publie")
  Rel(notification, bus, "S'abonne")
  Rel(catalogue, db, "Lit")
  Rel(reservation, db, "Lit et écrit (y compris la table ressource)")
  Rel(paiement, psp, "Appelle")
  Rel(outbox, db, "Lit l'outbox")
  Rel(outbox, broker, "Publie")
```
