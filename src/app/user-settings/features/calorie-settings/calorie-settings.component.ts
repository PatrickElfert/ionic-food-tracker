import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IntakeSource } from '../../../shared/interfaces/user';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { lastValueFrom, Observable, ReplaySubject } from 'rxjs';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { CaloricIntakeForm } from '../../../shared/ui/calculate-intake-form/calculate-intake-form.component';

@Component({
  selector: 'app-calorie-settings',
  templateUrl: './calorie-settings.component.html',
  styleUrls: ['./calorie-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalorieSettingsComponent {
  constructor(private userSettingsService: UserSettingsService) {}

  public intakeSource = IntakeSource;
  public intakeSourceChanged$ = new ReplaySubject<IntakeSource>(1);

  public vm$: Observable<{ intakeSource: IntakeSource; invalid: boolean }> =
    this.intakeSourceChanged$.pipe(
      startWith(undefined),
      switchMap((intakeSource) =>
        this.userSettingsService.queryUserSettings().pipe(
          tap((userSettings) => {
            this.calculateIntakeForm.patchValue(
              userSettings.caloricIntakeVariables
            );
            this.fixedCalories.patchValue(userSettings.fixedCalories);
          }),
          map((userSettings) => ({
            intakeSource: intakeSource ?? userSettings.intakeSource,
            invalid:
              (this.calculateIntakeForm.invalid &&
                intakeSource === IntakeSource.calculated) ||
              (this.fixedCalories.invalid &&
                intakeSource === IntakeSource.fixed),
          }))
        )
      )
    );

  calculateIntakeForm: FormControl<CaloricIntakeForm | undefined> =
    new FormControl();
  fixedCalories: FormControl<number | undefined> = new FormControl(undefined, {
    nonNullable: true,
    validators: [Validators.required],
  });

  public onSave(intakeSource: IntakeSource) {
    void lastValueFrom(
      this.userSettingsService.updateUserSettings({
        intakeSource,
        caloricIntakeVariables: this.calculateIntakeForm.value,
        fixedCalories: this.fixedCalories.value,
      })
    );
  }

  public intakeSourceChanged($event: any) {
    this.intakeSourceChanged$.next($event.detail.value);
  }
}
