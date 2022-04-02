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
import { Observable, ReplaySubject } from 'rxjs';
import { format } from 'date-fns';
import { map, switchMap } from 'rxjs/operators';
import { IngredientPayload, Meal, MealPayload } from './interfaces/meal';
import { Ingredient } from './interfaces/ingredient';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  selectedDateChangedAction = new ReplaySubject<Date>();
  public onSelectDateChanged$ = this.selectedDateChangedAction.asObservable();

  selectedDateFormatted$ = this.onSelectDateChanged$.pipe(
    map((date) => format(date, 'cccc'))
  );

  mealsAtSelectedDate$ = this.selectedDateChangedAction.pipe(
    switchMap((date) =>
      this.queryMealsAtDate(date).pipe(
        map((meals) => meals.map((m) => this.toMeal(m)))
      )
    )
  );

  constructor(private firestore: Firestore, private userService: UserService) {}

  public async removeMeal(id: string): Promise<void> {
    await deleteDoc(doc<MealPayload>(this.getMealCollectionReference(), id));
  }

  public getMealCollectionReference(): CollectionReference<MealPayload> {
    return collection(
      this.userService.userDocumentReference,
      'meal'
    ) as CollectionReference<MealPayload>;
  }

  public async setMeal(meal: Meal): Promise<void> {
    await setDoc<MealPayload>(
      doc<MealPayload>(this.getMealCollectionReference(), meal.id),
      this.toMealPayload(meal)
    );
  }

  public async createEmptyMeal(date: Date): Promise<string> {
    const id = v4();
    await setDoc<MealPayload>(
      doc<MealPayload>(this.getMealCollectionReference(), id),
      {
        id,
        date: date.getTime().toString(),
        name: '',
        ingredients: [],
      }
    );
    return id;
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
      new Date(mealPayload.date)
    );
  }

  public queryMealsAtDate(date: Date): Observable<MealPayload[]> {
    return collectionData<MealPayload>(
      query(
        this.getMealCollectionReference(),
        where('date', '==', date.getTime().toString())
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
      date: meal.date.getTime().toString(),
      ingredients: meal.ingredients.map((i) => this.toIngredientPayload(i)),
    };
  }
}
