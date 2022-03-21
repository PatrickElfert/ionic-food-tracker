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
  docData,
  collectionData,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import {BehaviorSubject, combineLatest, Observable, Subject, Subscription} from 'rxjs';
import { format } from 'date-fns';
import {map, mergeMap, tap} from 'rxjs/operators';
import { CalorieBarService } from './calorie-bar.service';
import { IngredientPayload, Meal, MealPayload } from './interfaces/meal';
import { Ingredient } from './interfaces/ingredient';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  selectedDateChangedAction: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  selectedDateChangedAction$ = this.selectedDateChangedAction.asObservable();

  mealsCollectionReference = collection(this.userService.userDocumentReference, 'meal') as CollectionReference<MealPayload>;

  setMealAction: Subject<Meal> = new Subject<Meal>();
  setMealAction$ = this.setMealAction.asObservable().pipe(
    tap(async m => {
      await setDoc<MealPayload>(doc<MealPayload>(this.mealsCollectionReference, m.id), this.toMealPayload(m));
    })
  );

  removeMealAction: Subject<string> = new Subject<string>();
  removeMealAction$ = this.removeMealAction.asObservable().pipe(tap(async id =>
    await deleteDoc(doc<MealPayload>(this.mealsCollectionReference, id))
  ));

  selectMealAction: Subject<Meal> = new Subject<Meal>();
  selectMealAction$ = this.selectMealAction.asObservable();

  mealsAtSelectedDate$ = this.selectedDateChangedAction$.pipe(mergeMap(date =>
    collectionData<MealPayload>(
      query(
        this.mealsCollectionReference,
        where('date', '==', format(date, 'MM/dd/yyyy'))
      )
    ).pipe(map((meals) => meals.map((m) => this.toMeal(m))))
  ));

  selectedMeal$ = this.selectMealAction$.pipe(mergeMap(s =>
    docData<MealPayload>(doc(this.mealsCollectionReference, s.id)).pipe(map(m => this.toMeal(m))
  )));

  currentCalories$ = this.mealsAtSelectedDate$.pipe(map(meals =>
    meals.reduce((acc, m) => {acc += m.calories; return acc;}, 0)
  ));

  private mealsSubscription: Subscription | undefined;

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private calorieBarService: CalorieBarService
  ) {}

  public async removeMeal(id: string): Promise<void> {
    this.removeMealAction.next(id);
  }

  public async setMeal(meal: Meal): Promise<void> {
    this.setMealAction.next(meal);
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

  private toMeal(mealPayload: MealPayload): Meal {
    return new Meal(
      mealPayload.ingredients?.map(
        (i) => new Ingredient(i.name, i.macros, i.currentAmount)
      ),
      mealPayload.name,
      mealPayload.id,
      mealPayload.date
    );
  }
}
