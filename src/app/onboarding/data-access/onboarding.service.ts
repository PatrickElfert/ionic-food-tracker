import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from "rxjs";
import { UserSettingsService } from '../../shared/data-access/user-settings.service';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  constructor(private userSettingsService: UserSettingsService) {}

  private caloricPreferenceAction = new ReplaySubject<{knowsIntake: boolean}>();

  public getPreference() {
    return this.caloricPreferenceAction;
  }

  public onSelectCaloricPreference(knowsIntake: boolean) {
    this.caloricPreferenceAction.next({knowsIntake});
  }
}
