import {  Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Meal } from './interfaces/meal';

export abstract class MealService extends CrudService<Meal> {

  constructor() {
    super();
  }

  public abstract queryMealsAtDate(date: Date): Observable<Meal[]>;
}
