import {  Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Meal } from './interfaces/meal';
import { Ingredient } from "./interfaces/ingredient";

export abstract class MealService extends CrudService<Meal> {

  constructor() {
    super();
  }

  public abstract queryMealsAtDate(date: Date): Observable<Meal[]>;
  public abstract addIngredientToMeal(mealName: string, ingredient: Ingredient): void;
}
