import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import {from, Observable, of} from 'rxjs';
import { UserService } from './user.service';
import { Auth } from '@angular/fire/auth';
import { map, switchMap, take } from 'rxjs/operators';
import {doc, docData, getDoc} from '@angular/fire/firestore';
import { User, UserSettings } from './interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(
    private auth: Auth,
    private userService: UserService,
    private router: Router
  ) {
    this.auth.onAuthStateChanged(this.userService.signInFlowAction);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userService.signInFlowCompleted$.pipe(
      switchMap((userDocumentReference) => {
        if (userDocumentReference) {
          return this.userService.userSettingsReference$.pipe(
            take(1),
            switchMap(ref => getDoc(ref)),
            map((settingsDoc) => {
              if (settingsDoc.exists()) {
                return true;
              } else {
                return this.router.parseUrl('/onboarding/welcome');
              }
            })
          );
        } else {
          return of(false);
        }
      })
    );
  }
}
