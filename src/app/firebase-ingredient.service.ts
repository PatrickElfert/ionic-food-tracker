import {
  collection,
  collectionData,
  CollectionReference,
  DocumentReference,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { IngredientService } from './ingredient.service';
import { Ingredient, IngredientPayload } from './interfaces/ingredient';
import { UserService } from './user.service';
import { switchMap, map, first, take } from "rxjs/operators";
import { endOfDay, startOfDay } from 'date-fns';
import { Injectable } from "@angular/core";

@Injectable()
export class FirebaseIngredientService extends IngredientService {
  constructor(private userService: UserService) {
    super();
  }

  public queryIngredientsAtDate(date: Date): Observable<Ingredient[]> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        collectionData<IngredientPayload>(
          query(
            this.getIngredientCollectionReference(userDocRef),
            where('createdDate', '>', startOfDay(date).getTime()),
            where('createdDate', '<', endOfDay(date).getTime())
          ),
        )
      ),
      map((ingredients) => ingredients.map(this.toIngredient))
    );
  }

  public delete(id: string): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((userDocRef) =>
        from(
          deleteDoc(doc(this.getIngredientCollectionReference(userDocRef), id))
        )
      ),
    );
  }

  public create(ingredient: Ingredient) {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((userDocRef) =>
        from(
          setDoc(
            doc(this.getIngredientCollectionReference(userDocRef), ingredient.id),
            this.toIngredientPayload(ingredient)
          )
        )
      ),
    );
  }

  public update(
    ingredient: Partial<Ingredient> & { id: string }
  ): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((userDocRef) =>
        from(
          updateDoc(
            doc<IngredientPayload>(
              this.getIngredientCollectionReference(userDocRef),
              ingredient.id
            ),
            this.toUpdateIngredient(ingredient)
          )
        )
      ),
    );
  }

  private getIngredientCollectionReference(userDocRef: DocumentReference) {
    return collection(
      userDocRef,
      'ingredients'
    ) as CollectionReference<IngredientPayload>;
  }

  private toIngredient(ingredientPayload: IngredientPayload): Ingredient {
    return new Ingredient(
      ingredientPayload.id,
      ingredientPayload.name,
      ingredientPayload.brand,
      ingredientPayload.macros,
      ingredientPayload.currentAmount,
      ingredientPayload.mealCategory,
      new Date(ingredientPayload.createdDate)
    );
  }

  private toIngredientPayload(ingredient: Ingredient): IngredientPayload {
    return {
      id: ingredient.id,
      name: ingredient.name,
      brand: ingredient.brand,
      macros: ingredient.macros,
      currentAmount: ingredient.currentAmount,
      mealCategory: ingredient.mealCategory,
      createdDate: ingredient.createdDate.getTime(),
    };
  }

  private toUpdateIngredient(
    ingredient: Partial<Ingredient>
  ): Partial<IngredientPayload> {
    return {
      name: ingredient.name,
      macros: ingredient.macros,
      currentAmount: ingredient.currentAmount,
      mealCategory: ingredient.mealCategory,
    };
  }
}
