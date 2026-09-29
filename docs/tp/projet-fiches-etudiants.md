# Architecture logicielle : projet fil rouge

Les séances sont notées S1 à S10 (séance 1 à séance 10). Chaque étudiant tire une variante en S1 et la garde jusqu'à la soutenance.

## Règles communes

- **Starter commun** : réservation de ressources partagées, avec les contextes Catalogue, Réservation, Paiement et Notification.
- **Travail individuel** : chaque étudiant a sa propre variante et son propre dépôt Git, créé à partir du starter.
- **Décisions** : une par TP (travaux pratiques), sous forme d'ADR (Architecture Decision Record) numérotés de ADR-001 à ADR-007 (`docs/adr/`). Aucune réponse n'est « la bonne » en soi : un choix n'est défendable que s'il est justifié par les attributs qualité de votre variante.
- **Dossier final** : rendu la veille de S10, il comprend :
  - les ADR-001 à ADR-007, dont un ADR marqué « Superseded » après S6 ;
  - les scénarios d'attributs qualité (ADR-001) et l'utility tree (ADR-002) ;
  - les diagrammes C4 (modèle Context, Containers, Components, Code) de niveaux 1, 2 et 3, la context map et le tableau d'évaluation (en figures des ADR) ;
  - le dépôt avec les diffs de S3 (règle dependency-cruiser qui passe) et S4 (port, test vert).
- **Soutenance** : 8 min de présentation et 4 min de questions. Elle évalue la cohérence entre le contexte, les attributs qualité et les décisions, et non l'originalité de la solution.

Dans chaque fiche, les attributs qualité sont listés **sans ordre** : décider de leur priorité est l'objet du TP de S1 (ADR-001).

---

## Variante 1 - Billetterie d'événements

**Contexte** : une plateforme vend les places de concerts et de spectacles. Les ventes ouvrent à heure fixe et des revendeurs partenaires accèdent au stock de places.

**Attributs qualité prioritaires** (sans ordre) :
- coût d'exploitation hors pics ;
- tenue des pics de charge à l'ouverture des ventes ;
- équité d'accès (premier arrivé, premier servi ; pas de survente).

**Contraintes connues** : quota de billets par personne ; une place réservée mais non payée se libère au bout d'un délai.

---

## Variante 2 - Matériel hospitalier

**Contexte** : un groupement hospitalier réserve du matériel médical mobile (échographes, pompes, lits spécialisés) entre services et entre établissements.

**Attributs qualité prioritaires** (sans ordre) :
- traçabilité complète des mouvements ;
- disponibilité pendant les heures de service ;
- cohérence forte (un équipement ne peut jamais être affecté deux fois).

**Contraintes connues** : intégration avec le SI (système d'information) hospitalier existant ; aucune perte d'historique n'est tolérée.

---

## Variante 3 - Coworking multi-sites

**Contexte** : un réseau d'espaces de coworking permet de réserver bureaux, salles de réunion et postes nomades sur plusieurs sites dans plusieurs villes.

**Attributs qualité prioritaires** (sans ordre) :
- vision consolidée pour la direction, qui peut accepter un léger retard ;
- disponibilité (chaque site doit continuer de fonctionner si un autre est en panne) ;
- tolérance aux pannes réseau entre sites.

**Contraintes connues** : chaque site a ses propres horaires et tarifs ; les abonnés multi-sites réservent partout.

---

## Variante 4 - Autopartage

**Contexte** : un service d'autopartage en ville permet de réserver un véhicule proche, de l'ouvrir avec son téléphone et de le rendre sur une zone autorisée.

**Attributs qualité prioritaires** (sans ordre) :
- cohérence forte seulement au moment du déverrouillage ;
- latence (trouver et réserver un véhicule proche en quelques secondes) ;
- prise en compte de la position géographique.

**Contraintes connues** : les véhicules sont connectés, mais la couverture réseau est parfois mauvaise.

---

## Variante 5 - Salles municipales

**Contexte** : une commune de taille moyenne permet aux associations et aux habitants de réserver ses salles (salles des fêtes, gymnases, salles de réunion).

**Attributs qualité prioritaires** (sans ordre) :
- fiabilité suffisante, sans exigence de haute disponibilité ;
- coût minimal de construction et d'exploitation ;
- simplicité (maintenance assurée par un seul agent technique à temps partiel).

**Contraintes connues** : volumes faibles (quelques centaines de réservations par mois) ; paiement en ligne pour certaines salles.

---

## Variante 6 - Équipements sportifs

**Contexte** : une plateforme loue des équipements sportifs (courts de tennis, terrains de padel, matériel) avec paiement en ligne et politique d'annulation.

**Attributs qualité prioritaires** (sans ordre) :
- latence acceptable à la réservation ;
- fiabilité du paiement et des remboursements (jamais de double débit, jamais de remboursement perdu) ;
- gestion des annulations selon une politique (délai, pénalité).

**Contraintes connues** : pics le week-end ; la politique d'annulation varie selon l'équipement.
