import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { FormControl, FormControlStatus } from '@angular/forms';
import { combineLatest, from, lastValueFrom, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { CaloricIntakeForm } from '../../../shared/ui/calculate-intake-form/calculate-intake-form.component';
import { IntakeSource } from '../../../shared/interfaces/user';
import { intakeFormDefault } from '../../utils/form-defaults';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.sass'],
})
export class IntakeComponent implements OnInit {
  public knowsIntake$ = this.activatedRoute.params.pipe(
    map((p) => JSON.parse(p.knowsIntake) as boolean)
  );
  public fixedCalories = new FormControl<number>(2000, { nonNullable: true });
  public caloricIntakeForm: FormControl<CaloricIntakeForm> = new FormControl(
    intakeFormDefault,
    { nonNullable: true }
  );

  private vm$: Observable<{
    status: FormControlStatus;
    formValues: CaloricIntakeForm;
    fixedCalories: number;
    knowsIntake: boolean;
  }> = combineLatest([
    this.caloricIntakeForm.valueChanges.pipe(
      startWith(this.caloricIntakeForm.value)
    ),
    this.fixedCalories.valueChanges.pipe(startWith(this.fixedCalories.value)),
    this.knowsIntake$,
    this.caloricIntakeForm.statusChanges.pipe(
      startWith(this.caloricIntakeForm.status)
    ),
  ]).pipe(
    map(([formValues, fixedCalories, knowsIntake, status]) => ({
      knowsIntake,
      status,
      formValues,
      fixedCalories,
    }))
  );
  constructor(
    public userSettingsService: UserSettingsService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  public onConfirm(
    caloricIntakeForm: CaloricIntakeForm,
    fixedCalories: number,
    knowsIntake: boolean
  ) {
    void lastValueFrom(
      this.userSettingsService
        .initializeUserSettings({
          caloricIntakeVariables: caloricIntakeForm,
          fixedCalories,
          intakeSource: knowsIntake
            ? IntakeSource.fixed
            : IntakeSource.calculated,
        })
        .pipe(
          switchMap(() => from(this.createSuccessToast())),
          tap((toast) => {
            toast.present();
            this.router.navigate(['/']);
          })
        )
    );
  }

  private createSuccessToast() {
    return this.toastController.create({
      message: 'You are all set now!',
      duration: 3000,
      color: 'success',
      icon: 'thumbs-up-outline',
    });
  }
}
