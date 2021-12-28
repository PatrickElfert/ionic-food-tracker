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
    meal = new Meal(
      [
        new Ingredient('Brot', { protein: 9, carbs: 49, fat: 3.2 }, 100),
        new Ingredient('Erdbeeren', { protein: 0.7, carbs: 8, fat: 0.3 }, 100),
      ],
      'RandomMeal',
      '1',
      new Date().toString()
    );
  });

  it('should have correct base calories and macros', () => {
    expect(meal.calories).toBe(298.3);
    expect(meal.macros).toEqual({ protein: 9.7, carbs: 57, fat: 3.5 });
    meal.ingredients.push(ingredient);
    expect(meal.calories).toBe(497.3);
    expect(meal.macros).toEqual({ protein: 11.7, carbs: 80, fat: 14.5 });
  });
});
