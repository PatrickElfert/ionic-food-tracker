import { Injectable } from '@angular/core';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { UserSettings, UserSettingsPayload } from '../interfaces/user';
import {
  collection,
  CollectionReference,
  doc,
  docData,
  docSnapshots,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { UserSettingsService } from './user-settings.service';
import { UserService } from './user.service';
import { pickBy } from 'lodash';
import { CaloricIntakeVariables } from '../interfaces/caloric-intake-variables';

@Injectable()
export class DefaultUserSettingsService extends UserSettingsService {
  constructor(private firestore: Firestore, private userService: UserService) {
    super();
  }
  queryUserSettings(): Observable<UserSettings> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((user) =>
        docData<UserSettingsPayload>(
          this.buildUserSettingsDocumentReference(user.id)
        )
      ),
      map((payload) => this.toUserSettings(payload))
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
    const calorieSettings =
      typeof calories === 'number'
        ? { fixedCalories: calories, caloricIntakeVariables: undefined }
        : { caloricIntakeVariables: calories, fixedCalories: undefined };
    return this.userService.userDocumentReference$.pipe(
      tap(() => 'initializeUserSettings'),
      take(1),
      switchMap((user) =>
        from(
          setDoc(
            this.buildUserSettingsDocumentReference(user.id),
            this.toUserSettingsPayload({
              userId: user.id,
              ...calorieSettings,
              mealCategories: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
            })
          )
        )
      )
    );
  }

  public buildUserSettingsDocumentReference(
    userId: string
  ): DocumentReference<UserSettingsPayload> {
    return doc<UserSettingsPayload>(
      collection(
        this.firestore,
        'userSettings'
      ) as CollectionReference<UserSettingsPayload>,
      userId
    );
  }

  public existsUserSettings(): Observable<boolean> {
    return this.userService.userDocumentReference$.pipe(
      switchMap((user) =>
        docSnapshots(this.buildUserSettingsDocumentReference(user.id))
      ),
      map((snapshot) => snapshot.exists())
    );
  }

  public toUserSettings(payload: UserSettingsPayload): UserSettings {
    return {
      ...payload,
      caloricIntakeVariables: payload.caloricIntakeVariables
        ? {
            ...payload.caloricIntakeVariables,
            birthdate: new Date(payload.caloricIntakeVariables.birthdate),
          }
        : undefined,
    };
  }

  public toUserSettingsPayload({
    caloricIntakeVariables,
    ...rest
  }: UserSettings): UserSettingsPayload {
    return {
      ...rest,
      caloricIntakeVariables: caloricIntakeVariables
        ? {
            ...caloricIntakeVariables,
            birthdate: caloricIntakeVariables.birthdate.getTime(),
          }
        : undefined,
    };
  }
}
