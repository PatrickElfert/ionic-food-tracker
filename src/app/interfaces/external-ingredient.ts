import { Macros } from '../macros';

export class ExternalIngredient{

  constructor(public name: string, public brand: string, public macros: Macros, public amount: number) {
  }

  get calories(): number {
    return (
      this.macros.carbs * 4 + this.macros.fat * 9 + this.macros.protein * 4
    );
  }
}
