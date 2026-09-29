# Starter : réservation de ressources partagées

Point de départ de votre fil rouge pour le module **Architecture logicielle** (4ESGI AL). Toute l'infrastructure est fournie et fonctionne : vous n'écrivez que ce que demande chaque TP.

## À faire avant la séance 1

Prérequis : **Node.js 22.12 ou plus** (`node -v`), Docker avec docker compose, Git, et l'extension VS Code « Markdown Preview Mermaid Support » (pour afficher les diagrammes).

1. Créez votre **dépôt Git personnel** à partir du starter (selon les consignes du formateur), puis clonez-le.
2. Installez et lancez :

```bash
npm install
docker compose up -d --wait   # PostgreSQL + RabbitMQ
npm run start:dev             # API sur http://localhost:3000
```

Vérification :

```bash
curl http://localhost:3000/ressources
npm run test:demarrage   # l'injection de dépendances de toute l'application se résout
npm test                 # les tests « domaine » passent ; test/s4 et test/demo échouent : c'est normal (TP S4)
```

## Tour du starter

### Ce que fait l'application

Des ressources (salles, espaces, matériel, véhicules) sont réservées sur un créneau, payées auprès d'un prestataire de paiement (PSP) simulé, puis éventuellement annulées et remboursées. Chaque réservation est tracée dans un journal et notifiée au client.

| Requête | Rôle |
|---------|------|
| `GET /ressources?site=aix-centre` | lister les ressources (filtre facultatif par site) |
| `GET /ressources/proches?lat=43.52&lon=5.44&rayonKm=5` | ressources proches d'une position |
| `GET /ressources/:id/capacite?debut=...&fin=...` | capacité restante sur un créneau |
| `GET /ressources/:id/historique` | journal d'audit d'une ressource |
| `POST /reservations` | créer une réservation (`ressourceId`, `client`, `debut`, `fin`, `quantite`) |
| `POST /reservations/:id/paiement` | payer une réservation |
| `POST /reservations/:id/annulation` | annuler (et rembourser si elle est payée) |

Exemple :

```bash
curl -X POST http://localhost:3000/reservations -H 'content-type: application/json' \
  -d '{"ressourceId":"r-001","client":"alice","debut":"2026-10-05T09:00:00Z","fin":"2026-10-05T11:00:00Z","quantite":2}'
```

### Organisation du code

```text
src/
├── main.ts, app.module.ts
├── catalogue/           ressources, recherche de proximité
├── reservation/         agrégat Réservation (domain/), capacité, journal d'audit, paiement et annulation
├── paiement/            appels au PSP simulé
├── notification/        courriels (affichés dans la console), abonné aux événements
└── shared/
    ├── database/        pool PostgreSQL, Transactions
    ├── events/          EventBus in-process (publier / abonner)
    └── outbox/          table outbox, relais périodique vers RabbitMQ (démo S7)
```

Dans chaque module :
- `infra/` contient le code qui parle à l'extérieur (SQL, PSP, géolocalisation, courriel) ainsi que des adapters **in-memory** prêts pour le TP S4 ;
- `ports/tokens.ts` contient les tokens d'injection prévus pour le TP S4 ;
- les fichiers `*.use-case.ts` contiennent les cas d'utilisation.

### Mécanismes fournis

- **EventBus** (`src/shared/events/event-bus.ts`) : `bus.publier(evenement)` et `bus.abonner(type, handler)`, dans le même processus. Pour un exemple d'abonnement, voir `src/notification/notification.handlers.ts`.
- **Outbox** (`src/shared/outbox/`) : chaque événement est enregistré dans la table `outbox` **dans la même transaction** que la modification métier. Toutes les secondes, un relais publie les messages en attente vers RabbitMQ (exchange `reservation.evenements`). Console RabbitMQ : http://localhost:15672 (guest / guest), file `notification.reservations`. L'outbox sert à la démonstration de S7 ; son fonctionnement est étudié dans le module Microservices, vous n'avez pas à la modifier.
- **PSP simulé** : `PSP_TAUX_ECHEC=0.3 npm run start:dev` fait échouer 30 % des paiements.
- **dependency-cruiser** : `npm run depcruise` vérifie les règles d'architecture de `.dependency-cruiser.cjs`, `npm run depcruise:modules` liste les dépendances entre modules, et `npm run depcruise:graph` produit le graphe complet au format Mermaid.

### Documentation d'architecture (`docs/`)

| Fichier | Usage |
|---------|-------|
| `docs/adr/ADR-000-gabarit.md` | format d'un ADR |
| `docs/adr/ADR-001` à `ADR-007` | un ADR à compléter par TP (S1 à S7), chacun avec sa figure pré-remplie (C4, utility tree, hexagone, context map, tableau d'évaluation) |
| `docs/c4/c4-niveau1.md`, `c4-niveau2.md`, `c4-niveau3.md` | diagrammes C4 génériques, à adapter à votre variante |
| `docs/ddd/context-map.md` | context map générique |

Les diagrammes sont en Mermaid : ils s'affichent sur GitLab et GitHub, ainsi que dans VS Code avec l'extension « Markdown Preview Mermaid Support ». Vous **modifiez** un gabarit, vous ne partez jamais d'une page blanche.

## Commandes

| Commande | Rôle |
|----------|------|
| `npm run start:dev` | API en mode watch |
| `npm test` | tous les tests (Vitest) |
| `npm run test:demarrage` | vérifier que toute l'application se câble (providers, tokens) |
| `npm run test:s4 -- <variante>` | uniquement le test S4 de votre variante : `billetterie`, `hopital`, `coworking`, `autopartage`, `salles` ou `sports` |
| `npm run depcruise` | vérifier les règles de dépendances |
| `npm run depcruise:modules` | lister les dépendances entre modules |
| `npm run build` | compiler (vérifie aussi les types) |
| `docker compose down -v && docker compose up -d --wait` | repartir d'une base vierge |

## Problèmes fréquents

- **`Nest can't resolve dependencies of ...`** : un provider n'est pas déclaré dans le module, ou il est injecté par sa classe alors que le module le déclare par un token (ou l'inverse).
- **Import d'une interface utilisée dans un constructeur** : utilisez `import type { MonPort } from '...'`, sinon la compilation échoue.
- **Port déjà utilisé** (3000, 5432, 5672) : arrêtez le service local concerné, ou lancez l'API avec `PORT=3001 npm run start:dev`.
