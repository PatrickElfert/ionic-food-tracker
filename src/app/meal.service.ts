import {  Observable } from 'rxjs';
import { Meal } from './interfaces/meal';
import { Ingredient } from "./interfaces/ingredient";

export abstract class MealService {

  constructor() {}

  public abstract queryMealsAtDate(date: Date): Observable<Meal[]>;
  public abstract addIngredientToMeal(currentDate: Date, mealName: string, ingredient: Ingredient): Observable<void>;

  public abstract removeIngredientFromMeal(meal: Meal, ingredient: Ingredient): Observable<void>;
}
