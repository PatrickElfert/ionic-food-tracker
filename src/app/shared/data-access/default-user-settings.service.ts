import { Injectable } from '@angular/core';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { UserSettings } from '../interfaces/user';
import {
  collection,
  CollectionReference,
  doc,
  docData, docSnapshots,
  Firestore,
  setDoc,
  updateDoc
} from "@angular/fire/firestore";
import { map, switchMap, take, tap } from "rxjs/operators";
import { from, Observable } from 'rxjs';
import { UserSettingsService } from './user-settings.service';
import { UserService } from './user.service';
import { pickBy } from 'lodash';
import { CaloricIntakeVariables } from '../../onboarding/interfaces/caloric-intake-variables';

@Injectable()
export class DefaultUserSettingsService extends UserSettingsService {

  constructor(private firestore: Firestore, private userService: UserService) {
    super();
  }
  queryUserSettings(): Observable<UserSettings> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((user) =>
        docData<UserSettings>(this.buildUserSettingsDocumentReference(user.id))
      )
    );
  }
  updateUserSettings(userSettings: Partial<UserSettings>): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((user) =>
        from(
          updateDoc(
            this.buildUserSettingsDocumentReference(user.id),
            pickBy(userSettings, (value) => value !== undefined)
          )
        )
      )
    );
  }
  initializeUserSettings(
    calories: number | CaloricIntakeVariables
  ): Observable<void> {
    const caloriesPayload = typeof calories === 'number' ? { fixedCalories: calories } : {caloricIntakeVariables: calories};
    return this.userService.userDocumentReference$.pipe(
      tap(() => 'initializeUserSettings'),
      take(1),
      switchMap((user) =>
        from(
          setDoc(this.buildUserSettingsDocumentReference(user.id), {
            userId: user.id,
            ...caloriesPayload,
            mealCategories: ['breakfast', 'lunch', 'dinner', 'snacks'],
          })
        )
      )
    );
  }

  public buildUserSettingsDocumentReference(
    userId: string
  ): DocumentReference<UserSettings> {
    return doc<UserSettings>(
      collection(
        this.firestore,
        'userSettings'
      ) as CollectionReference<UserSettings>,
      userId
    );
  }

  public existsUserSettings(): Observable<boolean> {
    return this.userService.userDocumentReference$.pipe(
      switchMap(user => docSnapshots(this.buildUserSettingsDocumentReference(user.id))),
      map(snapshot => snapshot.exists())
    );
  }
}
