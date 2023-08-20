import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { FormControl, FormControlStatus, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, from, lastValueFrom, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { IonicModule, ToastController } from '@ionic/angular';
import {
  CalculateIntakeFormComponent,
  CaloricIntakeForm
} from '../../../shared/ui/calculate-intake-form/calculate-intake-form.component';
import { IntakeSource } from '../../../shared/interfaces/user';
import { intakeFormDefault } from '../../utils/form-defaults';
import { AsyncPipe, NgIf } from '@angular/common';

export interface IntakeVM {
  status: string;
  form: CaloricIntakeForm | undefined;
  fixedCalories: number | undefined;
  knowsIntake: boolean;
  confirmDisabled: boolean;
}

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
  styleUrls: ['./intake.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    NgIf,
    CalculateIntakeFormComponent,
    AsyncPipe
  ],
  standalone: true
})
export class IntakeComponent implements OnInit {
  public knowsIntake$ = this.activatedRoute.params
    .pipe(map((p) => JSON.parse(p.knowsIntake) as boolean))
    .pipe(tap(() => this.initializeFormValues()));
  public fixedCalories: FormControl<number> = new FormControl();
  public caloricIntakeForm: FormControl<CaloricIntakeForm> = new FormControl();
  public fixedCalories$ = this.fixedCalories.valueChanges;
  public caloricIntakeForm$ = combineLatest([
    this.caloricIntakeForm.valueChanges,
    this.caloricIntakeForm.statusChanges,
  ]).pipe(map(([form, status]) => ({ form, status })));

  public vm$: Observable<IntakeVM> = combineLatest([
    this.caloricIntakeForm$,
    this.fixedCalories$,
    this.knowsIntake$,
  ]).pipe(
    map(([{ status, form }, fixedCalories, knowsIntake]) =>
      this.createIntakeVM(knowsIntake, status, form, fixedCalories)
    )
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

  private createIntakeVM(
    knowsIntake: boolean,
    status: string,
    form: CaloricIntakeForm,
    fixedCalories: number
  ): IntakeVM {
    return {
      knowsIntake,
      status,
      form,
      fixedCalories,
      confirmDisabled:
        (knowsIntake && !fixedCalories) ||
        (!knowsIntake && status === 'INVALID'),
    };
  }

  private createSuccessToast() {
    return this.toastController.create({
      message: 'You are all set now!',
      duration: 3000,
      color: 'success',
      icon: 'thumbs-up-outline',
    });
  }

  private initializeFormValues() {
    this.caloricIntakeForm.patchValue(intakeFormDefault);
    this.fixedCalories.patchValue(2000);
  }
}
