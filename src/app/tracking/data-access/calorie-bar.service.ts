import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { DiaryService } from './diary.service';
import { UserSettingsService } from '../../shared/data-access/user-settings.service';
import { calculateCaloricIntake } from '../../shared/utils/utils';

@Injectable({ providedIn: 'root' })
export class CalorieBarService {

  caloriesFromMeals$ = this.diaryService.diaryDay$.pipe(
    map(({ meals }) =>
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
        return calculateCaloricIntake(settings.caloricIntakeVariables);
      }
    })
  );

  vm$ = combineLatest([
    this.caloriesFromMeals$,
    this.calorieLimit$,
  ]).pipe(
    map(([caloriesFromMeals, calorieLimit]) => {
      const calorieFillWidth =
        caloriesFromMeals / (calorieLimit ?? 0);
      return {
        currentCalories: caloriesFromMeals,
        calorieFillWidth: calorieFillWidth > 1 ? 1 : calorieFillWidth,
        calorieLimit,
      };
    })
  );

  constructor(
    public userSettingsService: UserSettingsService,
    public diaryService: DiaryService
  ) {}
}
