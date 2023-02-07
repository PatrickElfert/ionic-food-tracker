import { Injectable } from '@angular/core';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { UserSettings } from '../interfaces/user';
import {
  collection,
  doc,
  docData,
  docSnapshots,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { UserSettingsService } from './user-settings.service';
import { UserService } from './user.service';
import { userSettingsConverter } from '../utils/converters';

@Injectable()
export class DefaultUserSettingsService extends UserSettingsService {
  constructor(private firestore: Firestore, private userService: UserService) {
    super();
  }
  public queryUserSettings(): Observable<UserSettings> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((user) =>
        docData(this.buildUserSettingsDocumentReference(user.id))
      )
    );
  }
  public updateUserSettings(
    userSettings: Partial<UserSettings>
  ): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      take(1),
      switchMap((user) =>
        from(
          setDoc(
            this.buildUserSettingsDocumentReference(user.id),
            userSettings,
            { merge: true }
          )
        )
      ),
    );
  }

  public initializeUserSettings(
    caloricIntakeSettings: Pick<
      UserSettings,
      'caloricIntakeVariables' | 'fixedCalories' | 'intakeSource'
    >
  ): Observable<void> {
    return this.userService.userDocumentReference$.pipe(
      tap(() => 'initializeUserSettings'),
      take(1),
      switchMap((user) =>
        from(
          setDoc(this.buildUserSettingsDocumentReference(user.id), {
            calories: undefined,
            ...caloricIntakeSettings,
            mealCategories: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
          })
        )
      )
    );
  }

  public buildUserSettingsDocumentReference(
    userId: string
  ): DocumentReference<UserSettings> {
    return doc(
      collection(this.firestore, 'userSettings').withConverter(
        userSettingsConverter
      ),
      userId
    );
  }

  public userSettingsExist(): Observable<boolean> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((user) =>
        docSnapshots(this.buildUserSettingsDocumentReference(user.id))
      ),
      map((snapshot) => snapshot.exists())
    );
  }
}
