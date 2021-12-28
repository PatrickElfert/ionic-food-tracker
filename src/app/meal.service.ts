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
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { format } from 'date-fns';
import { map } from 'rxjs/operators';
import { CalorieBarService } from './calorie-bar.service';
import { IngredientPayload, Meal, MealPayload } from './interfaces/meal';
import { Ingredient } from './interfaces/ingredient';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  selectedDate: BehaviorSubject<Date | undefined> = new BehaviorSubject<
    Date | undefined
  >(undefined);
  private mealsSubscription: Subscription | undefined;

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private calorieBarService: CalorieBarService
  ) {}

  public getMealCollection(): CollectionReference<MealPayload> {
    return collection(
      this.userService.userDocumentReference,
      'meal'
    ) as CollectionReference<MealPayload>;
  }

  public async removeMeal(id: string): Promise<void> {
    await deleteDoc(doc<MealPayload>(this.getMealCollection(), id));
  }

  public async setMeal(meal: Meal): Promise<void> {
    await setDoc<MealPayload>(
      doc<MealPayload>(this.getMealCollection(), meal.id),
      this.toMealPayload(meal)
    );
  }

  public subscribeToMeal(id: string): Observable<Meal | undefined> {
    return docData<MealPayload>(doc(this.getMealCollection(), id)).pipe(
      map((m) => this.toMeal(m))
    );
  }

  public subscribeToMeals(date: Date): Observable<Meal[]> {
    return collectionData<MealPayload>(
      query(
        this.getMealCollection(),
        where('date', '==', format(date, 'MM/dd/yyyy'))
      )
    ).pipe(map((meals) => meals.map((m) => this.toMeal(m))));
  }

  public subscribeToCurrentTrackerDate(
    callback: (meals: Meal[], currentDate: Date) => void
  ): void {
    this.selectedDate.subscribe((date) => {
      if (date) {
        this.subscribeToMealsForCurrentTrackerDate(date, callback);
      }
    });
  }

  private subscribeToMealsForCurrentTrackerDate(
    date: Date,
    callback: (meals: Meal[], currentDate: Date) => void
  ) {
    if (this.mealsSubscription) {
      this.mealsSubscription.unsubscribe();
    }
    this.mealsSubscription = this.subscribeToMeals(date).subscribe((meals) => {
      this.updateCurrentCalories(meals);
      callback(meals, date);
    });
  }

  private updateCurrentCalories(meals: Meal[]) {
    const calories = meals.reduce((acc, m) => {
      acc += m.calories;
      return acc;
    }, 0);
    this.calorieBarService.currentCalories.next(calories);
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
