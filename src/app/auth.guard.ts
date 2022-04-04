import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { Auth } from '@angular/fire/auth';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private auth: Auth, private userService: UserService) {
    this.auth.onAuthStateChanged(this.userService.handleAuthStateChangesAction);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userService.handleAuthStateChanges$.pipe(
      map((user) => user ? true : false),
    );
  }
}
