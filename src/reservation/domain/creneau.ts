// Value object : immuable, égal à un autre créneau s'il a les mêmes bornes.
export class Creneau {
  private constructor(
    readonly debut: Date,
    readonly fin: Date,
  ) {}

  static creer(debut: Date, fin: Date): Creneau {
    if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime())) {
      throw new Error('Créneau invalide : dates illisibles');
    }
    if (debut >= fin) throw new Error('Créneau invalide : le début doit précéder la fin');
    return new Creneau(debut, fin);
  }

  chevauche(autre: Creneau): boolean {
    return this.debut < autre.fin && autre.debut < this.fin;
  }

  equals(autre: Creneau): boolean {
    return this.debut.getTime() === autre.debut.getTime() && this.fin.getTime() === autre.fin.getTime();
  }
}
