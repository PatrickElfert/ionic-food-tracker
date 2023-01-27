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
import { switchMap, map, first } from 'rxjs/operators';

export class FirebaseIngredientService extends IngredientService {
  constructor(private userService: UserService) {
    super();
  }

  protected queryByIds(ids: string[]): Observable<Ingredient[]> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        collectionData<IngredientPayload>(
          query(
            this.getIngredientCollectionReference(userDocRef),
            where('id', 'in', ids)
          )
        )
      ),
      map((ingredientPayloads) => ingredientPayloads.map(this.toIngredient))
    );
  }

  protected onDelete(id: string): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        from(
          deleteDoc(doc(this.getIngredientCollectionReference(userDocRef), id))
        )
      ),
      first()
    );
  }

  protected onUpdate(
    ingredient: Partial<Ingredient> & { id: string }
  ): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
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
      first()
    );
  }

  protected onSetMeal(ingredient: Ingredient): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        from(
          setDoc(
            doc<IngredientPayload>(
              this.getIngredientCollectionReference(userDocRef),
              ingredient.id
            ),
            this.toIngredientPayload(ingredient)
          )
        )
      ),
      first()
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
      ingredientPayload.macros,
      ingredientPayload.currentAmount
    );
  }

  private toIngredientPayload(ingredient: Ingredient): IngredientPayload {
    return {
      id: ingredient.id,
      name: ingredient.name,
      macros: ingredient.macros,
      currentAmount: ingredient.currentAmount,
    };
  }

  private toUpdateIngredient(
    ingredient: Partial<Ingredient>
  ): Partial<IngredientPayload> {
    return {
      name: ingredient.name,
      macros: ingredient.macros,
      currentAmount: ingredient.currentAmount,
    };
  }
}
