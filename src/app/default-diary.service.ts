import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { DiaryService } from './diary.service';
import { MealService } from './meal.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultDiaryService extends DiaryService {
  public meals = this.selectedDate$.pipe(switchMap((date) => this.mealService.queryMealsAtDate(date)));
f constructor(private mealService: MealService) { 
    super();
  }

}
