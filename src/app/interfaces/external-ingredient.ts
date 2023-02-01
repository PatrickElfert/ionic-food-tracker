import { Macros } from '../macros';
import { calculateCalories, calculateMacros } from "./ingredient-utils";

export class ExternalIngredient{

  constructor(public name: string, public brand: string, public macros: Macros, public defaultAmount: number) {
    this.amount = defaultAmount;
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
