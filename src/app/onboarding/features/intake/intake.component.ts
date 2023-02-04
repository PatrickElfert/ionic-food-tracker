import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../data-access/onboarding.service';
import { Router } from '@angular/router';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { FormControl, FormControlStatus } from '@angular/forms';
import { combineLatest, from, lastValueFrom, Observable } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { CaloricIntakeVariables } from '../../../shared/interfaces/caloric-intake-variables';
import { ToastController } from '@ionic/angular';
import { CaloricIntakeForm } from '../../../shared/ui/calculate-intake-form/calculate-intake-form.component';
import { IntakeSource } from '../../../shared/interfaces/user';

export interface CaloricIntakeSettings {
  caloricIntakeVariables: CaloricIntakeVariables;
  fixedCalories: number;
  intakeSource: IntakeSource;
}

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.sass'],
})
export class IntakeComponent implements OnInit {
  public preferences$: Observable<{ knowsIntake: boolean }> =
    this.onboardingService.getPreference();
  public fixedCalories = new FormControl(2000, { nonNullable: true });
  public caloricIntakeForm: FormControl<CaloricIntakeForm> = new FormControl();

  private calorieSettings$: Observable<{
    caloricIntakeVariables: CaloricIntakeVariables;
    fixedCalories: number;
  }> = combineLatest([
    this.caloricIntakeForm.valueChanges.pipe(startWith({} as CaloricIntakeForm)),
    this.fixedCalories.valueChanges.pipe(startWith(this.fixedCalories.value)),
  ]).pipe(
    map(([caloricIntakeVariables, fixedCalories]) => ({
      caloricIntakeVariables,
      fixedCalories,
    }))
  );

  private vm$: Observable<{
    status: FormControlStatus;
    calorieSettings: CaloricIntakeSettings;
    knowsIntake: boolean;
  }> = combineLatest([
    this.calorieSettings$,
    this.preferences$,
    this.caloricIntakeForm.statusChanges.pipe(
      startWith(this.caloricIntakeForm.status)
    ),
  ]).pipe(
    map(([calorieSettings, preferences, status]) => ({
      knowsIntake: preferences.knowsIntake,
      status,
      calorieSettings: {
        ...calorieSettings,
        intakeSource: preferences.knowsIntake
          ? IntakeSource.fixed
          : IntakeSource.calculated,
      },
    }))
  );
  constructor(
    public onboardingService: OnboardingService,
    public userSettingsService: UserSettingsService,
    public router: Router,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  public onConfirm(calorieSettings: CaloricIntakeSettings) {
    void lastValueFrom(
      this.userSettingsService.initializeUserSettings(calorieSettings).pipe(
        switchMap(() =>
          from(
            this.toastController.create({
              message: 'You are all set now!',
              duration: 3000,
              color: 'success',
              icon: 'thumbs-up-outline',
            })
          )
        ),
        tap((toast) => {
          toast.present();
          this.router.navigate(['/']);
        })
      )
    );
  }
}
