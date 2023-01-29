import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { GoogleAuthProvider, UserCredential } from 'firebase/auth';
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';
import { Auth, authState, signInWithCredential } from '@angular/fire/auth';
import { filter, map } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService extends AuthService {
  authStateChanged$ = authState(this.auth).pipe(
    map((user) => (user ? { userId: user.uid, email: user.email } : undefined))
  );
  constructor(private auth: Auth, protected router: Router) {
    super(router);
  }

  signIn(): void {
    void this.signInWithGoogle();
  }

  signOut(): void {
    void this.auth.signOut();
  }

  async signInWithGoogle(): Promise<UserCredential> {
    const signInResult = await FirebaseAuthentication.signInWithGoogle();
    const credential = GoogleAuthProvider.credential(
      signInResult.credential?.idToken
    );
    return await signInWithCredential(this.auth, credential);
  }
}
