import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../data-access/onboarding.service';
import { Router } from '@angular/router';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { combineLatest, lastValueFrom, merge, Observable, of } from 'rxjs';
import {
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  ActivityLevel,
  CaloricIntakeVariables,
  Gender,
  Goal,
} from '../../../shared/interfaces/caloric-intake-variables';
import { isNotUndefinedOrNull } from '../../../shared/utils/utils';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.sass'],
})
export class IntakeComponent implements OnInit {
  public preferences$: Observable<{ knowsIntake: boolean }> =
    this.onboardingService.getPreference();
  public fixedIntake = new FormControl(2000);

  public activityLevel = ActivityLevel;
  public goal = Goal;
  public gender = Gender;

  public formDefault: CaloricIntakeVariables = {
    ageInYears: 20,
    heightInCm: 170,
    weightInKg: 70,
    gender: Gender.male,
    goal: Goal.keep,
    activityLevel: ActivityLevel.active,
  };

  public caloricIntakeForm = new FormGroup({
    ageInYears: new FormControl(this.formDefault.ageInYears, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    heightInCm: new FormControl(this.formDefault.heightInCm, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    weightInKg: new FormControl(this.formDefault.weightInKg, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    gender: new FormControl<Gender>(this.formDefault.gender, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    goal: new FormControl<Goal>(this.formDefault.goal, { nonNullable: true }),
    activityLevel: new FormControl<ActivityLevel>(
      this.formDefault.activityLevel,
      {
        nonNullable: true,
        validators: [Validators.required]
      }
    ),
  });

  public caloricIntakeFormValues$ = this.caloricIntakeForm.valueChanges.pipe(
    startWith(of(this.formDefault))
  );
  public caloricIntakeFormStatus$ = this.caloricIntakeForm.statusChanges.pipe(
    startWith('VALID')
  );

  public caloricIntakeVariables$: Observable<
    CaloricIntakeVariables | undefined
  > = combineLatest([
    this.caloricIntakeFormValues$,
    this.caloricIntakeFormStatus$,
  ]).pipe(
    switchMap(([values, status]) =>
      status === 'VALID' ? of(values as CaloricIntakeVariables) : of(undefined)
    ),
    tap((value) => console.log(value))
  );

  private calorieSettings$: Observable<CaloricIntakeVariables | number | undefined> = merge(
    this.caloricIntakeVariables$,
    this.fixedIntake.valueChanges.pipe(filter(isNotUndefinedOrNull))
  ).pipe(shareReplay(1));

  private vm$: Observable<{
    knowsIntake: boolean;
    calorieSettings: CaloricIntakeVariables | number | undefined;
  }> = combineLatest([this.calorieSettings$, this.preferences$]).pipe(
    map(([calorieSettings, preferences]) => ({
      calorieSettings,
      knowsIntake: preferences.knowsIntake,
    }))
  );

  constructor(
    public onboardingService: OnboardingService,
    public userSettingsService: UserSettingsService,
    public router: Router
  ) {}

  ngOnInit() {}

  public onConfirm(calorieSettings: CaloricIntakeVariables | number) {
    void lastValueFrom(
      this.userSettingsService
        .initializeUserSettings(calorieSettings)
        .pipe(tap(() => this.router.navigate(['/'])))
    );
  }
}
