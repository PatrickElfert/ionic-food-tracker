import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user';

@Injectable()
export abstract class UserSettingsService {
  constructor() {}

  abstract queryUserSettings(): Observable<UserSettings>;
  abstract updateUserSettings(
    userSettings: Partial<UserSettings>
  ): Observable<void>;

  abstract existsUserSettings(): Observable<boolean>;

  abstract initializeUserSettings(
    caloricIntakeSettings: Pick<
      UserSettings,
      'caloricIntakeVariables' | 'fixedCalories' | 'intakeSource'
    >
  ): Observable<void>;
}
