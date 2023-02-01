import { Ingredient } from './ingredient';
import { v4 } from "uuid";

describe('MealOverviewComponent', () => {
  let ingredient: Ingredient;

  beforeEach(() => {
    ingredient = new Ingredient(
      v4(),
      'Nutella',
      'Ferrero',
      { protein: 2, carbs: 23, fat: 11 },
      37,
      'Breakfast',
      new Date()
    );
  });

  it('ingredient should have correct macros and calories after amount changes', () => {
    ingredient.amount = 74;
    expect(ingredient.calories).toBe(398);
    expect(ingredient.macros).toEqual({ protein: 4, carbs: 46, fat: 22 });
    expect(ingredient.amount).toBe(74);
  });

  it('ingredient should have correct base macros and calories', () => {
    expect(ingredient.calories).toBe(199);
    expect(ingredient.macros).toEqual({ protein: 2, carbs: 23, fat: 11 });
    expect(ingredient.amount).toBe(37);
  });
});
