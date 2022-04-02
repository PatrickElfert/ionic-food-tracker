import { Macros } from '../macros';
import { Ingredient } from './ingredient';

export class Meal {
  constructor(
    public ingredients: Ingredient[],
    public name: string,
    public id: string,
    public date: Date
  ) {}

  get calories() {
    return (
      this.macros.carbs * 4 + this.macros.fat * 9 + this.macros.protein * 4
    );
  }

  get macros(): Macros {
    return this.ingredients.reduce(
      (acc, i) => {
        acc.protein += i.macros.protein;
        acc.fat += i.macros.fat;
        acc.carbs += i.macros.carbs;
        return acc;
      },
      { protein: 0, fat: 0, carbs: 0 }
    );
  }
}

export type IngredientPayload = Pick<
  Ingredient,
  'name' | 'macros' | 'currentAmount'
>;
export type MealPayload = Pick<Meal, 'name' | 'id' > & {
  date: number;
  ingredients: IngredientPayload[];
};
