import { switchMap } from 'rxjs/operators';
import { DiaryService } from './diary.service';
import { MealService } from './meal.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class DefaultDiaryService extends DiaryService {
  constructor(private mealService: MealService) {
    super();
  }

  public diaryDay$ = this.selectedDate$.pipe(
    switchMap((date) =>
      this.mealService
        .queryMealsAtDate(date)
        .pipe(map((meals) => ({ date, meals })))
    )
  );

}
