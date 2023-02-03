import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user';
import { CaloricIntakeVariables } from "../interfaces/caloric-intake-variables";

@Injectable()
export abstract class UserSettingsService {
  constructor() {}

  abstract queryUserSettings(): Observable<UserSettings>;
  abstract updateUserSettings(userSettings: UserSettings): Observable<void>;

  abstract existsUserSettings(): Observable<boolean>;

  abstract initializeUserSettings(
    calories: number | CaloricIntakeVariables,
  ): Observable<void>;
}
