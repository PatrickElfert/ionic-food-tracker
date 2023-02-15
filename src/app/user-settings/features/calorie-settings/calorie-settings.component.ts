import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IntakeSource, UserSettings } from '../../../shared/interfaces/user';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { from, lastValueFrom, Observable, combineLatest, Subject } from 'rxjs';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import {
  CalculateIntakeFormComponent,
  CaloricIntakeForm,
} from '../../../shared/ui/calculate-intake-form/calculate-intake-form.component';
import { IonicModule, ToastController } from '@ionic/angular';
import { AsyncPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface CalorieSettingsVM {
  intakeSource: IntakeSource;
  saveButtonDisabled: boolean;
  intakeForm: CaloricIntakeForm | undefined;
  fixedCalories: number | undefined;
}

@Component({
  selector: 'app-calorie-settings',
  templateUrl: './calorie-settings.component.html',
  styleUrls: ['./calorie-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonicModule,
    AsyncPipe,
    NgIf,
    KeyValuePipe,
    NgForOf,
    CalculateIntakeFormComponent,
    ReactiveFormsModule,
  ],
})
export class CalorieSettingsComponent {
  constructor(
    private userSettingsService: UserSettingsService,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute
  ) {}

  public intakeSource = IntakeSource;
  public intakeSourceAction = new Subject<IntakeSource>();
  public calculateIntakeForm: FormControl<CaloricIntakeForm | undefined> =
    new FormControl();
  public fixedCalories: FormControl<number | undefined> = new FormControl(
    undefined,
    {
      nonNullable: true,
      validators: [Validators.required],
    }
  );
  public intakeSource$ = this.intakeSourceAction.pipe(startWith(undefined));
  public intakeForm$ = combineLatest([
    this.calculateIntakeForm.valueChanges,
    this.calculateIntakeForm.statusChanges,
  ]).pipe(map(([form, status]) => ({ form, status })));
  public fixedCalories$ = this.fixedCalories.valueChanges.pipe(
    startWith(undefined)
  );

  public userSettings$ = this.activatedRoute.data.pipe(
    map((data) => data.userSettings as UserSettings),
    tap((userSettings) => this.initializeFormValues(userSettings))
  );

  public vm$: Observable<CalorieSettingsVM> = combineLatest([
    this.intakeSource$,
    this.intakeForm$,
    this.fixedCalories$,
    this.userSettings$,
  ]).pipe(
    map(([intakeSource, { form, status }, fixedCalories, userSettings]) =>
      this.calculateVM(userSettings, status, intakeSource, form, fixedCalories)
    )
  );

  private initializeFormValues(userSettings: UserSettings) {
    this.calculateIntakeForm.patchValue(userSettings.caloricIntakeVariables);
    this.fixedCalories.patchValue(userSettings.fixedCalories);
  }

  public onSave({
    fixedCalories,
    intakeForm,
    intakeSource,
  }: CalorieSettingsVM) {
    void lastValueFrom(
      this.userSettingsService
        .updateUserSettings({
          intakeSource,
          fixedCalories,
          caloricIntakeVariables: intakeForm,
        })
        .pipe(
          switchMap(() => from(this.createSuccessToast())),
          catchError((err) => from(this.createErrorToast(err))),
          tap((toast) => toast.present())
        )
    );
  }

  private createSuccessToast() {
    return this.toastController.create({
      message: 'Saved',
      duration: 2000,
      color: 'success',
    });
  }

  private createErrorToast(err: Error) {
    return this.toastController.create({
      message: err.message,
      duration: 2000,
      color: 'danger',
    });
  }

  public intakeSourceChanged($event: any) {
    this.intakeSourceAction.next($event.detail.value);
  }

  private calculateVM(
    userSettings: UserSettings,
    formStatus: string,
    intakeSource?: IntakeSource,
    intakeForm?: CaloricIntakeForm,
    fixedCalories?: number
  ): CalorieSettingsVM {
    const settings = {
      intakeSource: intakeSource ?? userSettings.intakeSource,
      intakeForm: intakeForm ?? userSettings.caloricIntakeVariables,
      fixedCalories: fixedCalories ?? userSettings.fixedCalories,
    };
    return {
      ...settings,
      saveButtonDisabled:
        (formStatus === 'INVALID' &&
          settings.intakeSource === IntakeSource.calculated) ||
        (!fixedCalories && settings.intakeSource === IntakeSource.fixed),
    };
  }
}
