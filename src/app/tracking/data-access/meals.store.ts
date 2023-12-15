import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {
  Source,
  splitRequestSources,
  toRequestSource,
  toSource,
} from '@state-adapt/rxjs';
import { createAdapter } from '@state-adapt/core';
import { Meal } from '../interfaces/meal';
import { Ingredient } from '../interfaces/ingredient';
import { adapt } from '@state-adapt/angular';
import { chain } from 'lodash';
import { Injectable } from '@angular/core';
import { CurrentDayStore } from './current-day.store';
import { IngredientService } from './ingredient.service';
import { ToastService } from '../../shared/data-access/toast.service';

@Injectable()
export class MealsStore {
  constructor(
    private currentDayStore: CurrentDayStore,
    private ingredientService: IngredientService,
    private toastService: ToastService
  ) {}

  private ingredientsLoaded$ = this.currentDayStore.store.currentDay$.pipe(
    switchMap((currentDay) =>
      this.ingredientService.queryIngredientsAtDate(currentDay)
    ),
    toSource('Ingredients loaded')
  );

  private mealsAdapter = createAdapter<Meal[]>()({
    ingredientsLoadedLoaded: (_, ingredients: Ingredient[]) =>
      this.consolidateToMeals(ingredients),
    selectors: {
      calories: (state) =>
        state.reduce((acc, m) => {
          acc += m.calories;
          return acc;
        }, 0),
      meals: (state) => state,
    },
  });

  private addIngredient$ = new Source<Ingredient>('addIngredient$ request$');
  private addIngredientRequest$ = this.addIngredient$.pipe(
    withLatestFrom(this.currentDayStore.store.currentDay$),
    switchMap(([_ingredient, date]) => {
      _ingredient.payload.createdDate = date;
      return this.ingredientService.create(_ingredient.payload);
    }),
    tap(() => this.toastService.showSuccessToast('Ingredient added!')),
    toRequestSource('add ingredient')
  );

  private addIngredientRequest = splitRequestSources(
    'add ingredient',
    this.addIngredientRequest$
  );

  private consolidateToMeals(ingredients: Ingredient[]) {
    return chain(ingredients)
      .groupBy((i) => i.mealCategory)
      .map((groupedIngredients, key) => new Meal(groupedIngredients, key))
      .value();
  }

  public store = adapt(new Array<Meal>(), {
    adapter: this.mealsAdapter,
    sources: {
      ingredientsLoadedLoaded: this.ingredientsLoaded$,
      noop: [
        this.addIngredientRequest.success$,
        this.addIngredientRequest.error$,
      ],
    },
    path: 'TrackingFeature.Meals',
  });
}
