import { Injectable } from '@angular/core';
import { IngredientDiscoveryService } from './ingredient-discovery.service';
import { ExternalIngredient } from '../interfaces/external-ingredient';
import { from, Observable } from 'rxjs';
import { UserService } from '../../shared/data-access/user.service';
import { switchMap, take } from 'rxjs/operators';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentReference,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { userManagedIngredientConverter } from '../utils/userManagedIngredientConverter';

@Injectable({
  providedIn: 'root',
})
export class UserManagedIngredientDiscoveryService
  implements IngredientDiscoveryService
{
  constructor(private userService: UserService) {}

  queryIngredientsByBarcode(barcode: string): Observable<ExternalIngredient[]> {
    throw new Error('Method not implemented.');
  }

  queryIngredientsByName(name: string): Observable<ExternalIngredient[]> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((userDocRef) =>
        collectionData(
          query(
            this.getUserManagedIngredientCollectionReference(userDocRef),
            where('name', '==', name)
          )
        )
      )
    );
  }

  create(ingredient: ExternalIngredient) {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((userDocRef) =>
        from(
          setDoc(
            doc(
              this.getUserManagedIngredientCollectionReference(userDocRef),
              ingredient.id
            ),
            ingredient
          )
        )
      )
    );
  }

  delete(id: string): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((userDocRef) =>
        from(
          deleteDoc(
            doc(
              this.getUserManagedIngredientCollectionReference(userDocRef),
              id
            )
          )
        )
      )
    );
  }

  update(ingredient: Partial<ExternalIngredient & {id: string}>): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((userDocRef) =>
        from(
          setDoc(
            doc(
              this.getUserManagedIngredientCollectionReference(userDocRef),
              ingredient.id
            ),
            ingredient,
            { merge: true }
          )
        )
      )
    );
  }

  private getUserManagedIngredientCollectionReference(
    userDocRef: DocumentReference
  ) {
    return collection(userDocRef, 'userManagedIngredients').withConverter(
      userManagedIngredientConverter
    );
  }
}
