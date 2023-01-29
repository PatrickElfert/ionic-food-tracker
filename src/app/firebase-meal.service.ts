import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  query,
  setDoc,
  where,
  collectionData,
  DocumentReference,
  Firestore,
  getFirestore,
  runTransaction,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import { from, Observable } from 'rxjs';
import { startOfDay, endOfDay } from 'date-fns';
import { first, map, switchMap, take } from 'rxjs/operators';
import { Meal, MealPayload } from './interfaces/meal';
import { Ingredient, IngredientPayload } from './interfaces/ingredient';
import { MealService } from './meal.service';
import { updateDoc } from 'firebase/firestore';
import { Injectable } from '@angular/core';
import { pickBy } from 'lodash';
import { FirebaseApp } from '@angular/fire/app';
import { v4 } from "uuid";

@Injectable()
export class FirebaseMealService extends MealService {
  constructor(private userService: UserService, private firestore: Firestore) {
    super();
  }

  protected queryByIds(ids: string[]): Observable<Meal[]> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        collectionData<MealPayload>(
          query(
            this.getMealCollectionReference(userDocRef),
            where('id', 'in', ids)
          )
        )
      ),
      map((mealPayloads) => mealPayloads.map(this.toMeal))
    );
  }

  protected onDelete(id: string): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        from(
          deleteDoc(
            doc<MealPayload>(this.getMealCollectionReference(userDocRef), id)
          )
        )
      )
    );
  }

  protected onUpdate(meal: Partial<Meal> & { id: string }): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        from(
          updateDoc(
            doc<MealPayload>(
              this.getMealCollectionReference(userDocRef),
              meal.id
            ),
            this.toUpdateMeal(meal)
          )
        )
      ),
      first()
    );
  }

  protected onSetMeal(meal: Meal): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        from(
          setDoc(
            doc<MealPayload>(
              this.getMealCollectionReference(userDocRef),
              meal.id
            ),
            this.toCreateMeal(meal)
          )
        )
      ),
      first()
    );
  }

  public queryMealsAtDate(date: Date): Observable<Meal[]> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        collectionData<MealPayload>(
          query(
            this.getMealCollectionReference(userDocRef),
            where('date', '>', startOfDay(date).getTime()),
            where('date', '<', endOfDay(date).getTime())
          )
        )
      ),
      map((mealPayloads) => mealPayloads.map((m) => this.toMeal(m)))
    );
  }

  private getMealCollectionReference(
    userDocumentReference: DocumentReference
  ): CollectionReference<MealPayload> {
    return collection(
      userDocumentReference,
      'meal'
    ) as CollectionReference<MealPayload>;
  }

  private toMeal(mealPayload: MealPayload): Meal {
    return new Meal(
      mealPayload.ingredients?.map(
        (i) => new Ingredient(i.id, i.name, i.brand, i.macros, i.currentAmount)
      ),
      mealPayload.name,
      mealPayload.id,
      new Date(mealPayload.date)
    );
  }

  private toIngredientPayload(ingredient: Ingredient): IngredientPayload {
    return {
      id: ingredient.id,
      name: ingredient.name,
      brand: ingredient.brand,
      currentAmount: ingredient.currentAmount,
      macros: ingredient.macros,
    };
  }

  private toUpdateMeal(meal: Partial<Meal>): Partial<MealPayload> {
    return pickBy(
      {
        name: meal.name,
        date: meal.date?.getTime(),
        ingredients: meal.ingredients?.map((i) => this.toIngredientPayload(i)),
      },
      (value) => value !== undefined
    );
  }

  private toCreateMeal(meal: Meal): MealPayload {
    return {
      name: meal.name,
      id: meal.id,
      date: meal.date.getTime(),
      ingredients: meal.ingredients.map((i) => this.toIngredientPayload(i)),
    };
  }

  addIngredientToMeal(mealName: string, ingredient: Ingredient): void {
    this.userService.userDocumentReference$
      .pipe(
        switchMap((userDocRef) =>
          runTransaction(userDocRef.firestore, async (transaction) => {
            const mealDocRef = doc<MealPayload>(
              this.getMealCollectionReference(userDocRef),
              query(where('name', '==', mealName))
            );
            const mealDoc = await transaction.get(mealDocRef);
            if (!mealDoc.exists) {
              transaction.set(
                mealDocRef,
                this.toCreateMeal(
                  new Meal([ingredient], mealName, v4(), new Date())
                )
              );
            }
            const meal = this.toMeal(mealDoc.data() as MealPayload);
            meal.ingredients.push(ingredient);
            transaction.update(mealDocRef, this.toUpdateMeal(meal));
          })
        ),
        take(1)
      )
      .subscribe();
  }
}
