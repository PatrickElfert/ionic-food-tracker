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
  docData,
} from '@angular/fire/firestore';
import { UserService } from './user.service';
import { from, lastValueFrom, Observable } from 'rxjs';
import { startOfDay, endOfDay } from 'date-fns';
import { first, map, switchMap, take } from 'rxjs/operators';
import { Meal, MealPayload } from './interfaces/meal';
import { Ingredient, IngredientPayload } from './interfaces/ingredient';
import { MealService } from './meal.service';
import { Injectable } from '@angular/core';
import { pickBy } from 'lodash';
import { v4 } from 'uuid';

@Injectable()
export class FirebaseMealService extends MealService {
  constructor(private userService: UserService) {
    super();
  }

  public deleteMeal(id: string): Observable<void> {
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

  public removeIngredientFromMeal(
    meal: Meal,
    ingredient: Ingredient
  ): Observable<void> {
    console.log(meal);
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        runTransaction(userDocRef.firestore, async (transaction) => {
          const mealDocRef = doc<MealPayload>(
            this.getMealCollectionReference(userDocRef),
            meal.id
          );
          const mealDoc = await transaction.get(mealDocRef);
          const mealDocData = mealDoc.data() as MealPayload;
          mealDocData.ingredients = mealDocData.ingredients.filter(
            (i) => i.id !== ingredient.id
          );
          transaction.update(mealDocRef, mealDocData);
        })
      )
    );
  }

  public addIngredientToMeal(
    date: Date,
    mealName: string,
    ingredient: Ingredient
  ): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        runTransaction(userDocRef.firestore, async (transaction) => {
          const mealDocuments = await lastValueFrom(this.queryMealsAtDate(date).pipe(first()));
          const mealDoc = mealDocuments.find((m) => m.name === mealName);
          if (mealDoc) {
            mealDoc.ingredients.push(ingredient);
            transaction.update(
              doc<MealPayload>(
                this.getMealCollectionReference(userDocRef),
                mealDoc.id
              ),
              this.toUpdateMeal(mealDoc)
            );
            return;
          }
          transaction.set(
            doc<MealPayload>(this.getMealCollectionReference(userDocRef), v4()),
            this.toCreateMeal(
              new Meal([ingredient], mealName, v4(), new Date())
            )
          );
        })
      ),
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
}
