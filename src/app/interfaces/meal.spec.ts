import { Ingredient } from './ingredient';
import { Meal } from './meal';

describe('MealOverviewComponent', () => {
  let ingredient: Ingredient;
  let meal: Meal;

  beforeEach(() => {
    ingredient = new Ingredient(
      'Nutella',
      { protein: 2, carbs: 23, fat: 11 },
      37
    );
    meal = new Meal([new Ingredient(), new Ingredient(), new Ingredient()]);
  });

  it('', () => {
    ingredient.amount = 74;
    expect(ingredient.calories).toBe(398);
    expect(ingredient.macros).toEqual({ protein: 4, carbs: 46, fat: 22 });
    expect(ingredient.amount).toBe(74);
  });
});
