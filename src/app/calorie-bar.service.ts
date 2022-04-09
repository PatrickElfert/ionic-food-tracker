import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { MealService } from './meal.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Ingredient } from './interfaces/ingredient';
import { CaloricIntakeVariables } from './onboarding/onboarding.service';
import { UserService } from './user.service';

const W_FACTOR = 161;
const M_FACTOR = 5;

@Injectable({ providedIn: 'root' })
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
    tap((m) => console.log('meals')),
    map((meals) =>
      meals
        ? meals.reduce((acc, m) => {
            acc += m.calories;
            return acc;
          }, 0)
        : 0
    )
  );

  calorieLimit$ = this.userService.userSettings$.pipe(
    map((settings) =>
      this.calculateCaloricIntake(settings.caloricIntakeVariables)
    )
  );

  vm$ = combineLatest([
    this.changeCaloriesManualAction$,
    this.caloriesFromMeals$,
    this.calorieLimit$
  ]).pipe(
    tap((c) => console.log('caloriesFromMeals')),
    map(([manual, caloriesFromMeals, calorieLimit]) => ({
      currentCalories: caloriesFromMeals + manual,
      calorieLimit
    }))
  );

  constructor(
    public mealService: MealService,
    public userService: UserService
  ) {}

  public calculateCaloricIntake(variables: CaloricIntakeVariables) {
    const { ageInYears, weightInKg, heightInCm, gender, activityLevel, goal } =
      variables;
    const activityFactor =
      activityLevel === 'LIGHT'
        ? 1.53
        : activityLevel === 'ACTIVE'
        ? 1.76
        : activityLevel === 'FAT FUCK' ? 1 : 2.25;
    const goalFactor = goal === 'LOSS' ? -10 : goal === 'GAIN' ? 10 : 0;
     const BMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * ageInYears) + (gender === 'MALE' ? M_FACTOR : W_FACTOR);
     const bmrIncludingActivity = BMR * activityFactor;
     return Math.round(bmrIncludingActivity / 100 * (100 + goalFactor));
  }
}
