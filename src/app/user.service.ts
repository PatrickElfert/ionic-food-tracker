import { Injectable } from '@angular/core';
import { Auth, signInWithCredential } from '@angular/fire/auth';
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';
import { GoogleAuthProvider } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  CollectionReference,
  setDoc,
  Firestore,
} from '@angular/fire/firestore';
import { User } from './interfaces/user';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { User as FirebaseUser } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, of, ReplaySubject } from 'rxjs';
import {filter, map, switchMap } from 'rxjs/operators';
import { isNotUndefinedOrNull} from '../utils';

export interface UserSettings {
  dailyIntake: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userSettings: UserSettings | undefined;
  public handleAuthStateChangesAction =
    new ReplaySubject<FirebaseUser | null>();
  public handleAuthStateChanges$ = this.handleAuthStateChangesAction
    .asObservable()
    .pipe(
      switchMap((user) => {
        console.log('user', user);
        if (!user && !this.auth.currentUser) {
          return from(FirebaseAuthentication.signInWithGoogle()).pipe(
            map((signInResult) =>
              GoogleAuthProvider.credential(signInResult.credential?.idToken)
            ),
            switchMap((credential) =>
              from(signInWithCredential(this.auth, credential))
            ),
            map((credentials) => credentials.user)
          );
        } else {
          return of(user);
        }
      }),
    );

  public userDocumentReference$ = this.handleAuthStateChanges$.pipe(
    filter(isNotUndefinedOrNull),
    map((user) => ({
      user,
      userDocumentReference: this.buildUserDocumentReference(user),
    })),
    switchMap(({ user, userDocumentReference }) =>
      from(getDoc<User>(userDocumentReference)).pipe(
        switchMap((userDoc) => {
          if (userDoc.exists()) {
            return of(userDoc.ref);
          } else {
            return from(
              setDoc(userDocumentReference, {
                userId: user.uid,
                email: user.email,
              })
            ).pipe(map(() => userDocumentReference));
          }
        })
      )
    )
  );

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  private buildUserDocumentReference(
    user: FirebaseUser
  ): DocumentReference<User> {
    return doc<User>(
      collection(this.firestore, 'user') as CollectionReference<User>,
      `${user.uid}`
    );
  }
}
