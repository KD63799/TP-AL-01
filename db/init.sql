-- Schéma et données de démonstration, chargés au premier démarrage de PostgreSQL.
-- Pour repartir de zéro : docker compose down -v && docker compose up -d

CREATE TABLE ressource (
  id        TEXT PRIMARY KEY,
  nom       TEXT NOT NULL,
  categorie TEXT NOT NULL,
  site      TEXT NOT NULL,
  capacite  INTEGER NOT NULL CHECK (capacite > 0),
  latitude  DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE reservation (
  id           TEXT PRIMARY KEY,
  ressource_id TEXT NOT NULL REFERENCES ressource(id),
  client       TEXT NOT NULL,
  debut        TIMESTAMPTZ NOT NULL,
  fin          TIMESTAMPTZ NOT NULL,
  quantite     INTEGER NOT NULL CHECK (quantite > 0),
  montant      NUMERIC(10, 2) NOT NULL,
  statut       TEXT NOT NULL,
  transaction_paiement TEXT,
  CHECK (debut < fin)
);

CREATE TABLE journal_audit (
  id           BIGSERIAL PRIMARY KEY,
  ressource_id TEXT NOT NULL REFERENCES ressource(id),
  action       TEXT NOT NULL,
  auteur       TEXT NOT NULL,
  horodatage   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE outbox (
  id           UUID PRIMARY KEY,
  type         TEXT NOT NULL,
  payload      JSONB NOT NULL,
  cree_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  publie_le    TIMESTAMPTZ
);

CREATE INDEX outbox_non_publies ON outbox (cree_le) WHERE publie_le IS NULL;

INSERT INTO ressource (id, nom, categorie, site, capacite, latitude, longitude) VALUES
  ('r-001', 'Salle Cézanne',   'salle',      'aix-centre',  12, 43.5283, 5.4497),
  ('r-002', 'Salle Mirabeau',  'salle',      'aix-centre',   6, 43.5263, 5.4455),
  ('r-003', 'Plateau Arbois',  'espace',     'aix-arbois', 40, 43.4870, 5.3710),
  ('r-004', 'Vidéoprojecteur', 'materiel',   'aix-centre',   1, 43.5283, 5.4497),
  ('r-005', 'Utilitaire 3 m3', 'vehicule',   'marseille',    1, 43.2965, 5.3698);

INSERT INTO journal_audit (ressource_id, action, auteur) VALUES
  ('r-001', 'CREATION', 'admin'),
  ('r-004', 'CREATION', 'admin');
