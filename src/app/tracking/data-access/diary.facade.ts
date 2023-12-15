import { Injectable } from '@angular/core';
import { CurrentDayStore } from './current-day.store';
import { MealsStore } from './meals.store';
import { joinStores } from '@state-adapt/rxjs';
import { UserSettingsService } from '../../shared/data-access/user-settings.service';
import { map } from 'rxjs/operators';

@Injectable()
export class DiaryFacade {
  constructor(
    private currentDayStore: CurrentDayStore,
    private mealsStore: MealsStore,
    private userSettingsService: UserSettingsService
  ) {}

  public nextDay() {
    this.currentDayStore.store.nextDay();
  }

  public previousDay() {
    this.currentDayStore.store.previousDay();
  }

  public calorieLimit$ = this.userSettingsService
    .queryUserSettings()
    .pipe(map((settings) => settings.calories));

  public todaysDiaryEntry$ = joinStores({
    meals: this.mealsStore.store,
    currentDay: this.currentDayStore.store,
  })({
    todaysDiaryEntry: (state) => ({
      currentDay: state.currentDay,
      meals: state.meals,
      calories: state.mealsCalories,
    }),
  })().todaysDiaryEntry$;
}
