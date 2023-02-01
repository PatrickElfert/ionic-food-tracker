import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { UserService } from '../shared/data-access/user.service';
import { Auth, authState } from '@angular/fire/auth';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User as FirebaseUser } from '@firebase/auth';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { User } from '../shared/interfaces/user';
import { UserCredential } from 'firebase/auth';
import { getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(
    private auth: Auth,
    private userService: UserService,
    private router: Router
  ) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return authState(this.auth).pipe(
      tap((user) => console.log('user', user)),
      map((user) => (user ? true : this.router.parseUrl('/onboarding')))
    );
  }
}

export const initializeUserDocument =
  (
    userDocRef: (user: FirebaseUser) => DocumentReference<User>
  ): ((observable: Observable<FirebaseUser>) => Observable<FirebaseUser>) =>
  (observable: Observable<FirebaseUser>) =>
    observable.pipe(
      switchMap((user) =>
        from(getDoc(userDocRef(user))).pipe(
          switchMap((userDoc) =>
            userDoc.exists()
              ? of(user)
              : from(
                  setDoc(userDocRef(user), {
                    userId: user.uid,
                    email: user.email,
                  })
                ).pipe(switchMap(() => of(user)))
          )
        )
      )
    );
