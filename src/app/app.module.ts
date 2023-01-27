import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAuth,
  getAuth,
  initializeAuth,
  browserLocalPersistence,
} from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { enterAnimation } from './animations';
import { FirebaseMealService } from './firebase-meal.service';
import { MealService } from './meal.service';
import { IngredientDiscoveryService } from './ingredient-discovery.service';
import { DefaultIngredientDiscoveryService } from './external-ingredient.service';
import { DiaryService } from './diary.service';
import { DefaultDiaryService } from './default-diary.service';

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
      navAnimation: enterAnimation,
    }),
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => whichAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MealService, useClass: FirebaseMealService },
    {
      provide: IngredientDiscoveryService,
      useValue: DefaultIngredientDiscoveryService,
    },
    {
      provide: DiaryService,
      useClass: DefaultDiaryService,
    },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
