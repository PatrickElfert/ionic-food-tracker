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
  DocumentReference,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import {combineLatest, merge, Observable, ReplaySubject, Subject} from 'rxjs';
import { format, startOfDay, endOfDay } from 'date-fns';
import {filter, map, mergeMap, switchMap, take} from 'rxjs/operators';
import { IngredientPayload, Meal, MealPayload } from './interfaces/meal';
import { Ingredient } from './interfaces/ingredient';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  public selectedDateChangedAction = new ReplaySubject<Date>();
  public onSelectDateChanged$ = this.selectedDateChangedAction.asObservable();

  public deleteMealAction = new Subject<Meal>();
  public setMealAction = new Subject<Meal>();

  public selectedDateFormatted$ = this.onSelectDateChanged$.pipe(
    map((date) => format(date, 'cccc'))
  );

  public mealsAtSelectedDate$ = combineLatest([
    this.selectedDateChangedAction,
    this.userService.userDocumentReference,
  ]).pipe(
    switchMap(([date, userDocumentReference]) =>
      this.queryMealsAtDate(date, userDocumentReference).pipe(
        map((meals) => meals.map((m) => this.toMeal(m)))
      )
    )
  );

  public onDeleteMeal$ = combineLatest([
    this.deleteMealAction,
    this.userService.userDocumentReference,
  ]).pipe(
    mergeMap(([meal, user]) =>
      deleteDoc(
        doc<MealPayload>(this.getMealCollectionReference(user), meal.id)
      )
    )
  );

  public onSetMeal$ = combineLatest([
    this.setMealAction,
    this.userService.userDocumentReference,
  ]).pipe(
    mergeMap(([meal, user]) =>
      setDoc(
        doc<MealPayload>(this.getMealCollectionReference(user), meal.id),
        this.toMealPayload(meal)
      )
    )
  );

  public onMealChanged$ = merge(this.onDeleteMeal$, this.onSetMeal$);

  constructor(private firestore: Firestore, private userService: UserService) {}

  public getMealCollectionReference(
    userDocumentReference: DocumentReference
  ): CollectionReference<MealPayload> {
    return collection(
      userDocumentReference,
      'meal'
    ) as CollectionReference<MealPayload>;
  }

  public createEmptyMeal(date: Date): string {
    const id = v4();
    this.onSetMeal$.pipe(take(1)).subscribe();
    this.setMealAction.next(new Meal([], '', id, date));
    return id;
  }

  public setSelectedDate(date: Date): void {
    this.selectedDateChangedAction.next(date);
  }

  public removeMeal(id: string): void {
    this.onDeleteMeal$.pipe(take(1)).subscribe();
    this.deleteMealAction.next(new Meal([], '', id, new Date()));
  }

  public setMeal(meal: Meal): void {
    this.onSetMeal$.pipe(take(1)).subscribe();
    this.setMealAction.next(meal);
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

  public queryMealsAtDate(
    date: Date,
    userDocumentReference: DocumentReference
  ): Observable<MealPayload[]> {
    return collectionData<MealPayload>(
      query(
        this.getMealCollectionReference(userDocumentReference),
        where('date', '>', startOfDay(date).getTime()),
        where('date', '<', endOfDay(date).getTime())
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
      date: meal.date.getTime(),
      ingredients: meal.ingredients.map((i) => this.toIngredientPayload(i)),
    };
  }
}
