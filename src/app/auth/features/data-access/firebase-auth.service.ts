import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { GoogleAuthProvider, UserCredential } from 'firebase/auth';
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';
import { Auth, authState, signInWithCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService extends AuthService {
  authStateChanged$ = authState(this.auth).pipe(
    map((user) => (user ? { userId: user.uid, email: user.email } : undefined)),
  );
  constructor(private auth: Auth, protected router: Router) {
    super(router);
  }

  async signInWithEmailAndPassword(email:string, password:string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth,email,password)
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
  }

  async signInWithGoogle(): Promise<UserCredential> {
    const signInResult = await FirebaseAuthentication.signInWithGoogle();
    const credential = GoogleAuthProvider.credential(
      signInResult.credential?.idToken
    );
    return await signInWithCredential(this.auth, credential);
  }

  async signUpWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signUpWithGoogle(): Promise<UserCredential> {
    return await this.signInWithGoogle();
  }
}
