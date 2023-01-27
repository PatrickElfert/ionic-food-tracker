import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Meal } from './interfaces/meal';

@Injectable({
  providedIn: 'root',
})
export abstract class MealService extends CrudService<Meal> {

  constructor() {
    super();
  }

  protected abstract queryMealsAtDate(date: Date): Observable<Meal[]>;
}
