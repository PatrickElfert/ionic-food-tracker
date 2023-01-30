import { Injectable } from '@angular/core';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { UserSettings } from './interfaces/user';
import {
  collection,
  CollectionReference,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { switchMap, take } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { UserSettingsService } from './user-settings.service';
import { UserService } from './user.service';
import { pickBy } from 'lodash';
import { CaloricIntakeVariables } from './onboarding/onboarding.service';

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
    fixedCalories?: number,
    caloricIntakeVariables?: CaloricIntakeVariables,
  ): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((user) =>
        from(
          setDoc(this.buildUserSettingsDocumentReference(user.id), {
            userId: user.id,
            fixedCalories,
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
}
