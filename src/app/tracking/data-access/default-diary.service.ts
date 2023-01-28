import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MealService } from '../../meal.service';
import { DiaryService } from './diary.service';

@Injectable()
export class DefaultDiaryService extends DiaryService {

  public diaryDay$ = this.selectedDate$.pipe(
    switchMap((date) =>
      this.mealService
        .queryMealsAtDate(date)
        .pipe(map((meals) => ({ date, meals })))
    )
  );
  constructor(private mealService: MealService) {
    super();
  }
}
