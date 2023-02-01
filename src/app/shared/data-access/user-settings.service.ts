import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSettings } from '../interfaces/user';
import { CaloricIntakeVariables } from '../../onboarding/onboarding.service';

@Injectable()
export abstract class UserSettingsService {
  constructor() {}

  abstract queryUserSettings(): Observable<UserSettings>;
  abstract updateUserSettings(userSettings: UserSettings): Observable<void>;

  abstract initializeUserSettings(
    fixedCalories?: number,
    caloricIntakeVariables?: CaloricIntakeVariables
  ): Observable<void>;
}
