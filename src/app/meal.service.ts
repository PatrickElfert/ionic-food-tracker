import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  query,
  setDoc,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { format } from 'date-fns';
import { map, switchMap, tap } from 'rxjs/operators';
import { IngredientPayload, Meal, MealPayload } from './interfaces/meal';
import { Ingredient } from './interfaces/ingredient';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  selectedDateChangedAction = new BehaviorSubject<Date>(new Date());

  selectedDateFormatted$ = this.selectedDateChangedAction.pipe(
    map((date) => format(date, 'cccc'))
  );

  mealsCollectionReference = collection(
    this.userService.userDocumentReference,
    'meal'
  ) as CollectionReference<MealPayload>;

  mealsAtSelectedDate$ = this.selectedDateChangedAction.pipe(
    switchMap((date) => this.queryMealsAtDate(date as Date).pipe(
        map((meals) => meals.map((m) => this.toMeal(m)))
      ))
  );

  constructor(private firestore: Firestore, private userService: UserService) {}

  public async removeMeal(id: string): Promise<void> {
    await deleteDoc(doc<MealPayload>(this.mealsCollectionReference, id));
  }

  public async setMeal(meal: Meal): Promise<void> {
    await setDoc<MealPayload>(
      doc<MealPayload>(this.mealsCollectionReference, meal.id),
      this.toMealPayload(meal)
    );
  }

  public setSelectedDate(date: Date): void {
    this.selectedDateChangedAction.next(date);
  }

  public toMeal(mealPayload: MealPayload): Meal {
    return new Meal(
      mealPayload.ingredients?.map(
        (i) => new Ingredient(i.name, i.macros, i.currentAmount)
      ),
      mealPayload.name,
      mealPayload.id,
      mealPayload.date
    );
  }

  private queryMealsAtDate(date: Date): Observable<MealPayload[]> {
    return collectionData<MealPayload>(
      query(
        this.mealsCollectionReference,
        where('date', '==', format(date, 'MM/dd/yyyy'))
      )
    );
  }

  private toIngredientPayload(ingredient: Ingredient): IngredientPayload {
    return {
      name: ingredient.name,
      currentAmount: ingredient.currentAmount,
      macros: ingredient.macros,
    };
  }

  private toMealPayload(meal: Meal): MealPayload {
    return {
      name: meal.name,
      id: meal.id,
      date: meal.date,
      ingredients: meal.ingredients.map((i) => this.toIngredientPayload(i)),
    };
  }
}
