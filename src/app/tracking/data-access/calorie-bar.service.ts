import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { DiaryService } from './diary.service';
import { UserSettingsService } from '../../shared/data-access/user-settings.service';

@Injectable()
export class CalorieBarService {
  private caloriesFromMeals$ = this.diaryService.diaryDay$.pipe(
    map(({ meals }) =>
      meals
        ? meals.reduce((acc, m) => {
            acc += m.calories;
            return acc;
          }, 0)
        : 0
    )
  );

  private calorieLimit$ = this.userSettingsService
    .queryUserSettings()
    .pipe(map((settings) => settings.calories));

  public vm$ = combineLatest([this.caloriesFromMeals$, this.calorieLimit$]).pipe(
    map(([caloriesFromMeals, calorieLimit]) => {
      const calorieFillWidth = caloriesFromMeals / (calorieLimit ?? 0);
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
