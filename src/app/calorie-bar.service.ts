import { Injectable } from '@angular/core';
import {map, tap} from 'rxjs/operators';
import { MealService } from './meal.service';
import {BehaviorSubject, combineLatest} from 'rxjs';
import { Ingredient } from './interfaces/ingredient';

@Injectable({providedIn: 'root'})
export class CalorieBarService {
  changeCaloriesManualAction = new BehaviorSubject<Ingredient[]>([]);
  changeCaloriesManualAction$ = this.changeCaloriesManualAction
    .asObservable()
    .pipe(
      map((ingredients) =>
        ingredients
          ? ingredients.reduce((acc, m) => {
              acc += m.calories;
              return acc;
            }, 0)
          : 0
      )
    );

  caloriesFromMeals$ = this.mealService.mealsAtSelectedDate$.pipe(
    tap(m => console.log('meals')),
    map((meals) =>
      meals
        ? meals.reduce((acc, m) => {
            acc += m.calories;
            return acc;
          }, 0)
        : 0
    )
  );

  vm$ = combineLatest([this.changeCaloriesManualAction$, this.caloriesFromMeals$]).pipe(
    tap(c => console.log('caloriesFromMeals')),
    map(([manual, caloriesFromMeals]) => ({ currentCalories: caloriesFromMeals + manual }))
  );

  calorieLimit = 2000;

  constructor(public mealService: MealService) {}
}
