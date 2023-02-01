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
} from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { IngredientDiscoveryService } from '../../../tracking/data-access/ingredient-discovery.service';
import { DefaultIngredientDiscoveryService } from '../../../tracking/data-access/default-ingredient-discovery.service';
import { DiaryService } from '../../../tracking/data-access/diary.service';
import { DefaultDiaryService } from '../../../tracking/data-access/default-diary.service';
import { AuthGuardModule } from "@angular/fire/auth-guard";
import { AuthService } from "../../../auth/features/data-access/auth.service";
import { FirebaseAuthService } from "../../../auth/features/data-access/firebase-auth.service";
import { IngredientService } from "../../../tracking/data-access/ingredient.service";
import { FirebaseIngredientService } from "../../../tracking/data-access/firebase-ingredient.service";
import { UserSettingsService } from "../../../shared/data-access/user-settings.service";
import { DefaultUserSettingsService } from "../../../shared/data-access/default-user-settings.service";

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
    provideAuth(() => whichAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: IngredientService, useClass: FirebaseIngredientService},
    {
      provide: IngredientDiscoveryService,
      useClass: DefaultIngredientDiscoveryService,
    },
    {
      provide: DiaryService,
      useClass: DefaultDiaryService,
    },
    {
      provide: AuthService,
      useClass: FirebaseAuthService,
    },
    {
      provide: UserSettingsService,
      useClass: DefaultUserSettingsService,
    }
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
