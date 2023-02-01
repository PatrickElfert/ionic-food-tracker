import { Macros } from './macros';
import { calculateCalories, calculateMacros } from '../utils/ingredient-utils';

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

  set amount(amount: number) {
    this.macros = calculateMacros(this.macros, this.defaultAmount, amount);
    this.defaultAmount = amount;
  }
  get amount(): number {
    return this.defaultAmount;
  }
  get calories(): number {
    return calculateCalories(this.macros);
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
