import { Macros } from '../macros';

export class Ingredient {
  public currentAmount: number;

  constructor(
    public id: string,
    public name: string,
    public brand: string,
    public macros: Macros,
    private defaultAmount: number,
    public mealCategory: string,

    public createdDate: Date,
  ) {
    this.currentAmount = defaultAmount;
  }

  get amount(): number {
    return this.currentAmount ?? 100;
  }

  set amount(amount: number) {
    const { protein, fat, carbs } = this.macros;
    this.macros = {
      protein: (protein / this.currentAmount) * amount,
      fat: (fat / this.currentAmount) * amount,
      carbs: (carbs / this.currentAmount) * amount,
    };
    this.currentAmount = amount;
  }

  get calories(): number {
    return (
      this.macros.carbs * 4 + this.macros.fat * 9 + this.macros.protein * 4
    );
  }
}

export interface IngredientPayload {
  id: string;
  name: string;
  brand: string;
  macros: Macros;
  currentAmount: number;
  mealCategory: string;
  createdDate: number;
}
