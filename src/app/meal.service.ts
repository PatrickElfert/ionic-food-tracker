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
import { Meal } from './interfaces/meal';

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

  public getMealCollection(): CollectionReference<Meal> {
    return collection(
      this.userService.userDocumentReference,
      'meal'
    ) as CollectionReference<Meal>;
  }

  public async removeMeal(id: string): Promise<void> {
    await deleteDoc(doc<Meal>(this.getMealCollection(), id));
  }

  public async setMeal(meal: Meal): Promise<void> {
    await setDoc<Meal>(
      doc<Meal>(this.getMealCollection(), meal.id),
      Object.assign({}, meal)
    );
  }

  public subscribeToMeal(id: string): Observable<Meal | undefined> {
    return docData(doc(this.getMealCollection(), id)).pipe(
      map((m) => new Meal(m.ingredients, m.name, m.id, m.date))
    );
  }

  public subscribeToMeals(date: Date): Observable<Meal[]> {
    return collectionData<Meal>(
      query(
        this.getMealCollection(),
        where('date', '==', format(date, 'MM/dd/yyyy'))
      )
    ).pipe(
      map((meals) =>
        meals.map((m) => new Meal(m.ingredients, m.name, m.id, m.date))
      )
    );
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
      console.log(meals[0].ingredients);
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
}
