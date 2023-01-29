import { Injectable } from '@angular/core';
import { Auth, user as userChanges, signInWithCredential } from '@angular/fire/auth';
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';
import { GoogleAuthProvider, UserCredential } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  CollectionReference,
  setDoc,
  Firestore, docData
} from "@angular/fire/firestore";
import { User, UserSettings } from './interfaces/user';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { User as FirebaseUser } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  combineLatest,
  from,
  Observable,
  of, Subject
} from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { isNotUndefinedOrNull } from "../utils";
import { AuthService } from "./auth/features/data-access/auth.service";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  public setUserSettingsAction = new Subject<UserSettings>();

  public userDocumentReference$ = this.authService.authStateChanged$.pipe(
    filter(isNotUndefinedOrNull),
    map((user) => this.buildUserDocumentReference(user.userId)),
  );

  public userSettingsReference$ = this.userDocumentReference$.pipe(
    tap((ref) => console.log('userSettingsReference', ref.id)),
    map((ref) => this.buildUserSettingsDocumentReference(ref.id))
  );

  public onUserSettingsUpdate$ = combineLatest([
    this.userSettingsReference$,
    this.setUserSettingsAction,
  ]).pipe(
    switchMap(([userSettingsDoc, settings]) =>
      from(setDoc(userSettingsDoc, { ...settings, userId: userSettingsDoc.id }))
    ),
    tap((u) => console.log('user settings updated', u))
  );

  public userSettings$ = this.userSettingsReference$.pipe(
    switchMap((ref) => docData(ref)),
    tap((settings) => console.log('user settings', settings))
  );

  constructor(
    private router: Router,
    private firestore: Firestore,

    private authService: AuthService,
  ) {}

  public setUserSettings(userSettings: UserSettings): void {
    console.log('set user settings', userSettings);
    this.onUserSettingsUpdate$.pipe(take(1)).subscribe();
    this.setUserSettingsAction.next(userSettings);
  }

  public buildUserDocumentReference(userId: string): DocumentReference<User> {
      return doc<User>(
        collection(this.firestore, 'user') as CollectionReference<User>,
        userId
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
