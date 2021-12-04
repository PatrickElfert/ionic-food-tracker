import { Injectable } from '@angular/core';
import {Meal} from './meal-card/meal-card.component';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  meals: Meal[] = [];

  constructor() { }
}
