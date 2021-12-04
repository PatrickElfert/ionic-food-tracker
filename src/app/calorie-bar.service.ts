import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalorieBarService {
  public currentCalories = 0;
  public calorieLimit = 2000;
  constructor() { }
}
