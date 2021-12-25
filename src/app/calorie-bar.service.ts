import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MealService } from './meal.service';

@Injectable({
  providedIn: 'root',
})
export class CalorieBarService {
  public currentCalories = new BehaviorSubject(0);
  public calorieLimit = 2000;

  constructor() {}

  public addCalories(calories: number) {
    this.currentCalories.next(this.currentCalories.value + calories);
  }

  public reduceCalories(calories: number) {
    this.currentCalories.next(this.currentCalories.value - calories);
  }
}
