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

export interface UserSettings {
  dailyIntake: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public userDocumentReference!: DocumentReference<User>;
  public userSettings: UserSettings | undefined;

  constructor(
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  async handleAuth(): Promise<void> {
    if (this.auth.currentUser) {
      this.setUserDocumentReference(this.auth.currentUser);
      await this.router.navigate(['onboarding', 'welcome']);
    } else {
      const loginResult = await FirebaseAuthentication.signInWithGoogle();
      const credential = GoogleAuthProvider.credential(
        loginResult.credential?.idToken
      );
      const signInResult = await signInWithCredential(this.auth, credential);
      this.setUserDocumentReference(signInResult.user);
      const userDocument = await getDoc<User>(this.userDocumentReference);
      if (!userDocument.exists() && signInResult.user.email) {
        await setDoc(this.userDocumentReference, {
          userId: signInResult.user.uid,
          email: signInResult.user.email,
        });
        await this.router.navigate(['onboarding', 'welcome']);
      }
    }
  }

  private setUserDocumentReference(user: FirebaseUser): void {
    this.userDocumentReference = doc<User>(
      collection(this.firestore, 'user') as CollectionReference<User>,
      `${user.uid}`
    );
  }
}
