import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Auth, browserLocalPersistence } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private auth: Auth, private userService: UserService) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Observable((subscriber) => {
      this.auth.onAuthStateChanged(async (user) => {
        console.log('auth stateChanged');
        if (user) {
          await this.userService.signIn();
          subscriber.next(true);
        } else {
          await this.userService.signIn();
        }
      });
    });
  }
}
