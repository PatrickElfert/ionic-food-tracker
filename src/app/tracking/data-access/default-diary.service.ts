import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DiaryService } from './diary.service';
import { IngredientService } from './ingredient.service';
import { chain } from 'lodash';
import { Meal } from '../interfaces/meal';
import { Ingredient } from '../interfaces/ingredient';

@Injectable()
export class DefaultDiaryService extends DiaryService {
  public diaryDay$ = this.selectedDate$.pipe(
    switchMap((date) =>
      this.ingredientService.queryIngredientsAtDate(date).pipe(
        map((ingredients) => ({
          date,
          meals: this.consolidateToMeals(ingredients)
        }))
      )
    )
  );

  constructor(private ingredientService: IngredientService) {
    super();
  }

  private consolidateToMeals(ingredients: Ingredient[]) {
    return chain(ingredients)
      .groupBy((i) => i.mealCategory)
      .map((groupedIngredients, key) => new Meal(groupedIngredients, key))
      .value();
  }

}
