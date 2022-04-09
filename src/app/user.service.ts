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
  docData,
} from '@angular/fire/firestore';
import { User, UserSettings } from './interfaces/user';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { User as FirebaseUser } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  combineLatest,
  from,
  Observable,
  of,
  ReplaySubject,
  Subject,
} from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { isNotUndefinedOrNull } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public signInFlowAction = new ReplaySubject<FirebaseUser | null>();
  public signInFlowGoogle$ = this.signInFlowAction.asObservable().pipe(
    switchMap((user) => {
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
    })
  );

  public signInFlowCompleted$ = this.signInFlowGoogle$.pipe(
    switchMap((user) => {
      if (user) {
        return this.userDocumentFlow(of(user));
      } else {
        return of(undefined);
      }
    })
  );

  public setUserSettingsAction = new Subject<UserSettings>();

  public userDocumentReference$ = this.signInFlowCompleted$.pipe(
    filter(isNotUndefinedOrNull)
  );

  public userSettingsReference$ = this.userDocumentReference$.pipe(
    tap(ref => console.log('userSettingsReference', ref.id)),
    map((ref) => this.buildUserSettingsDocumentReference(ref.id))
  );

  public onUserSettingsUpdate$ = combineLatest([
    this.userSettingsReference$,
    this.setUserSettingsAction,
  ]).pipe(
    switchMap(([userSettingsDoc, settings]) =>
      from(setDoc(userSettingsDoc, { ...settings, userId: userSettingsDoc.id }))
    ),
    tap(u => console.log('user settings updated', u))
  );

  public userSettings$ = this.userSettingsReference$.pipe(
    switchMap((ref) => docData(ref)),
    tap((settings) => console.log('user settings', settings))
  );

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
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

  private userDocumentFlow(
    source: Observable<FirebaseUser>
  ): Observable<DocumentReference<User>> {
    return source.pipe(
      map((user) => ({
        user,
        userDocumentReference: this.buildUserDocumentReference(user.uid),
      })),
      switchMap(({ user, userDocumentReference }) =>
        from(getDoc<User>(userDocumentReference)).pipe(
          switchMap((userDoc) => {
            if (userDoc.exists()) {
              return of(userDoc.ref);
            } else {
              return from(
                setDoc<User>(userDocumentReference, {
                  userId: user.uid,
                  email: user.email,
                })
              ).pipe(map(() => userDocumentReference));
            }
          })
        )
      )
    );
  }
}
