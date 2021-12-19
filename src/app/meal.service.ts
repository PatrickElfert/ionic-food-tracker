import { Injectable } from '@angular/core';
import { Meal } from './meal-card/meal-card.component';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  public meals: Observable<Meal[]>;
  mealsCollection!: CollectionReference<Meal>;

  constructor(private firestore: Firestore, private userService: UserService) {
    this.meals = this.subscribeToMeals();
  }

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
            snapshot.data()?.id ?? v4()
          )
        );
      });
    });
  }

  private subscribeToMeals(): Observable<Meal[]> {
    if (this.userService.userDocumentReference) {
      this.mealsCollection = collection(
        this.userService.userDocumentReference,
        'meal'
      ) as CollectionReference<Meal>;
      return new Observable((subscriber) => {
        onSnapshot(this.mealsCollection, (col) => {
          subscriber.next(
            col.docs.map(
              (d) => new Meal(d.data().ingredients, d.data().name, d.data().id)
            )
          );
        });
      });
    }
    throw new Error('User Document not defined');
  }
}
