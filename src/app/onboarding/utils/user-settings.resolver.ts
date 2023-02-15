import { Observable } from 'rxjs';
import { UserSettings } from '../../shared/interfaces/user';
import { Resolve } from '@angular/router';
import { UserSettingsService } from '../../shared/data-access/user-settings.service';
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserSettingsResolver implements Resolve<UserSettings> {
  constructor(private userSettingsService: UserSettingsService) {}

  public resolve(): Observable<UserSettings> {
    return this.userSettingsService.queryUserSettings().pipe(take(1));
  }
}
