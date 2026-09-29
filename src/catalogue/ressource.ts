export interface Ressource {
  id: string;
  nom: string;
  categorie: string;
  site: string;
  capacite: number;
}

export interface Position {
  latitude: number;
  longitude: number;
}

export interface RessourceProche {
  ressourceId: string;
  distanceKm: number;
}
