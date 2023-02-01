import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Ingredient } from '../interfaces/ingredient';
import { CaloricIntakeVariables } from '../../onboarding/onboarding.service';
import { DiaryService } from './diary.service';
import { UserSettingsService } from "../../shared/data-access/user-settings.service";

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

  caloriesFromMeals$ = this.diaryService.diaryDay$.pipe(
    map(({meals}) =>
      meals
        ? meals.reduce((acc, m) => {
            acc += m.calories;
            return acc;
          }, 0)
        : 0
    )
  );

  calorieLimit$ = this.userSettingsService.queryUserSettings().pipe(
    map((settings) => {
      if (settings.fixedCalories) {
        return settings.fixedCalories;
      } else if (settings.caloricIntakeVariables) {
        return this.calculateCaloricIntake(settings.caloricIntakeVariables);
      }
    })
  );

  vm$ = combineLatest([
    this.changeCaloriesManualAction$,
    this.caloriesFromMeals$,
    this.calorieLimit$,
  ]).pipe(
    map(([manual, caloriesFromMeals, calorieLimit]) => {
      const calorieFillWidth = (caloriesFromMeals + manual) / (calorieLimit ?? 0);
        return {
          currentCalories: caloriesFromMeals + manual,
          calorieFillWidth: calorieFillWidth > 1 ? 1 : calorieFillWidth,
          calorieLimit,
        };
    })
  );

  constructor(
    public userSettingsService: UserSettingsService,
    public diaryService: DiaryService
  ) {}

  public calculateCaloricIntake(variables: CaloricIntakeVariables) {
    const { ageInYears, weightInKg, heightInCm, gender, activityLevel, goal } =
      variables;
    const activityFactor =
      activityLevel === 'LIGHTLY ACTIVE'
        ? 1.53
        : activityLevel === 'ACTIVE'
        ? 1.76
        : activityLevel === 'NOT ACTIVE'
        ? 1
        : 2.25;
    const goalFactor = goal === 'LOSS' ? -10 : goal === 'GAIN' ? 10 : 0;
    const BMR =
      10 * weightInKg +
      6.25 * heightInCm -
      5 * ageInYears +
      (gender === 'MALE' ? M_FACTOR : W_FACTOR);
    const bmrIncludingActivity = BMR * activityFactor;
    return Math.round((bmrIncludingActivity / 100) * (100 + goalFactor));
  }
}
