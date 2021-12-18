import { Component, OnInit } from '@angular/core';
import { Auth, signInWithCredential } from '@angular/fire/auth';
import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';
import { GoogleAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.sass'],
})
export class AppComponent implements OnInit {
  constructor(public auth: Auth) {}

  async ngOnInit(): Promise<void> {
    this.auth.onAuthStateChanged(async (user) => {
      await this.signIn();
    });
  }

  async signIn() {
    if (!this.auth.currentUser) {
      const loginResult = await FirebaseAuthentication.signInWithGoogle();
      const credential = GoogleAuthProvider.credential(
        loginResult.credential?.idToken
      );
      await signInWithCredential(this.auth, credential);
    }
  }
}
