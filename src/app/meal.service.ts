import { Injectable } from '@angular/core';
import { Meal } from './meal-card/meal-card.component';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  mealsCollection!: CollectionReference<Meal>;
  selectedDate: Date | undefined;

  constructor(private firestore: Firestore, private userService: UserService) {}

  public async removeMeal(id: string): Promise<void> {
    await deleteDoc(doc<Meal>(this.mealsCollection, id));
  }

  public async updateMeal(meal: Meal): Promise<void> {
    await setDoc<Meal>(
      doc<Meal>(this.mealsCollection, meal.id),
      Object.assign({}, meal)
    );
  }

  public subscribeToMeal(id: string): Observable<Meal | undefined> {
    return new Observable<Meal | undefined>((subscriber) => {
      onSnapshot<Meal>(doc(this.mealsCollection, id), (snapshot) => {
        subscriber.next(
          new Meal(
            snapshot.data()?.ingredients ?? [],
            snapshot.data()?.name ?? '',
            snapshot.data()?.id ?? v4(),
            snapshot.data()?.date ?? new Date().toISOString()
          )
        );
      });
    });
  }

  public subscribeToMeals(date: Date): Observable<Meal[]> {
    if (this.userService.userDocumentReference) {
      this.mealsCollection = collection(
        this.userService.userDocumentReference,
        'meal'
      ) as CollectionReference<Meal>;
      return new Observable((subscriber) => {
        onSnapshot(
          query(this.mealsCollection, where('date', '==', date)),
          (col) => {
            const meals = col.docs.map((d) => {
              const data = d.data();
              return new Meal(data.ingredients, data.name, data.id, data.date);
            });
            subscriber.next(meals);
          }
        );
      });
    }
    throw new Error('User Document not defined');
  }
}
