import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../data-access/onboarding.service';
import { Router } from '@angular/router';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, lastValueFrom, merge, Observable, Subject } from 'rxjs';
import { filter, map, share, shareReplay, switchMap, tap } from "rxjs/operators";
import {
  ActivityLevel,
  CaloricIntakeVariables,
  Gender,
  Goal,
} from '../../interfaces/caloric-intake-variables';
import { isNotUndefinedOrNull } from '../../../shared/utils/utils';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.sass'],
})
export class IntakeComponent implements OnInit {

  public preferences$: Observable<{ knowsIntake: boolean }> = this.onboardingService.getPreference();
  public fixedIntake = new FormControl(2000);

  // todo somehow get initial value
  public caloricIntakeForm = new FormGroup({
    ageInYears: new FormControl(20, { nonNullable: true }),
    heightInCm: new FormControl(170, { nonNullable: true }),
    weightInKg: new FormControl(70, { nonNullable: true }),
    gender: new FormControl<Gender>('MALE', { nonNullable: true }),
    goal: new FormControl<Goal>('KEEP', { nonNullable: true }),
    activityLevel: new FormControl<ActivityLevel>('LIGHTLY ACTIVE', {
      nonNullable: true,
    }),
  });

  public validCaloricIntakeVariables$: Observable<CaloricIntakeVariables> =
    combineLatest([
      this.caloricIntakeForm.valueChanges,
      this.caloricIntakeForm.statusChanges,
    ]).pipe(
      filter(([_, status]) => status === 'VALID'),
      map(
        ([caloricIntakeVariables]) =>
          caloricIntakeVariables as CaloricIntakeVariables
      )
    );

  private calorieSettings$: Observable<CaloricIntakeVariables | number> = merge(
    this.validCaloricIntakeVariables$,
    this.fixedIntake.valueChanges.pipe(filter(isNotUndefinedOrNull))
  ).pipe(shareReplay(1));

  constructor(
    public onboardingService: OnboardingService,
    public userSettingsService: UserSettingsService,
    public router: Router
  ) {}

  ngOnInit() {}

  public onConfirm() {
    void lastValueFrom(
      this.calorieSettings$.pipe(
        switchMap((calorieSettings) =>
          this.userSettingsService.initializeUserSettings(calorieSettings)
        ),
        tap(() => this.router.navigate(['/']))
      )
    );
  }
}
