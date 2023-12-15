import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { environment } from '../../../../environments/environment';
import {
  provideAuth,
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  connectAuthEmulator,
} from '@angular/fire/auth';
import {
  provideFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
} from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { AuthGuardModule } from '@angular/fire/auth-guard';
import { AuthService } from '../../../auth/features/data-access/auth.service';
import { FirebaseAuthService } from '../../../auth/features/data-access/firebase-auth.service';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { DefaultUserSettingsService } from '../../../shared/data-access/default-user-settings.service';
import {defaultStoreProvider} from "@state-adapt/angular";

const whichAuth = () => {
  let auth;
  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(getApp(), { persistence: browserLocalPersistence });
  } else {
    auth = getAuth();
  }
  return auth;
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios',
    }),
    AppRoutingModule,
    HttpClientModule,
    AuthGuardModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = whichAuth();
      if (environment.useEmulators) {
        const { authEmulatorHost, authEmulatorPort } = environment;
        connectAuthEmulator(auth, `http://${authEmulatorHost}:${authEmulatorPort}`, {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    provideFirestore(() => {
      // @ts-ignore
      const firestore = window.Cypress
        ? initializeFirestore(getApp(), { experimentalForceLongPolling: true, ignoreUndefinedProperties: true })
        : initializeFirestore(getApp(), {ignoreUndefinedProperties: true});
      if (environment.useEmulators) {
        const { firestoreEmulatorHost, firestoreEmulatorPort } = environment;
        connectFirestoreEmulator(firestore, firestoreEmulatorHost, firestoreEmulatorPort);
      }
      return firestore;
    }),
  ],
  providers: [
    defaultStoreProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: AuthService,
      useClass: FirebaseAuthService,
    },
    {
      provide: UserSettingsService,
      useClass: DefaultUserSettingsService,
    },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
