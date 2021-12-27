import { Macros } from '../macros';

export class Ingredient {
  private currentAmount: number;

  constructor(
    public name: string,
    public macros: Macros,
    private defaultAmount: number
  ) {
    // eslint-disable-next-line no-underscore-dangle
    this.currentAmount = defaultAmount;
  }

  get amount(): number {
    // eslint-disable-next-line no-underscore-dangle
    return this.currentAmount ?? 100;
  }

  set amount(amount: number) {
    const { protein, fat, carbs } = this.macros;
    this.macros = {
      // eslint-disable-next-line no-underscore-dangle
      protein: (protein / this.currentAmount) * amount,
      fat: (fat / this.currentAmount) * amount,
      carbs: (carbs / this.currentAmount) * amount,
    };
    // eslint-disable-next-line no-underscore-dangle
    this.currentAmount = amount;
  }

  get calories(): number {
    return (
      this.macros.carbs * 4 + this.macros.fat * 9 + this.macros.protein * 4
    );
  }
}
