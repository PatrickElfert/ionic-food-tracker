import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../../../shared/data-access/user.service';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { AuthService } from '../../../auth/features/data-access/auth.service';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userSettingsService: UserSettingsService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.authStateChanged$.pipe(
      switchMap((user) =>
        !user
          ? of(this.router.parseUrl('/auth'))
          : this.userSettingsService
              .existsUserSettings()
              .pipe(
                map((exists) =>
                  exists ? true : this.router.parseUrl('/onboarding')
                )
              )
      )
    );
  }
}
