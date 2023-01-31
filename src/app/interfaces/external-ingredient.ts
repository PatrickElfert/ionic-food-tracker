import { Macros } from '../macros';

export class ExternalIngredient{

  constructor(public name: string, public brand: string, public macros: Macros, public defaultAmount: number) {
    this.amount = defaultAmount;
  }

  set amount(amount: number) {
    const { protein, fat, carbs } = this.macros;
    this.macros = {
      protein: (protein / this.defaultAmount) * amount,
      fat: (fat / this.defaultAmount) * amount,
      carbs: (carbs / this.defaultAmount) * amount,
    };
    this.defaultAmount = amount;
  }
  get amount(): number {
    return this.defaultAmount;
  }
  get calories(): number {
    return (
      this.macros.carbs * 4 + this.macros.fat * 9 + this.macros.protein * 4
    );
  }
}
