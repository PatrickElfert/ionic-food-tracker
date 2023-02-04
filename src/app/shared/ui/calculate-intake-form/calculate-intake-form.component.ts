import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ActivityLevel,
  CaloricIntakeVariables,
  Gender,
  Goal,
} from '../../interfaces/caloric-intake-variables';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { startWith } from 'rxjs/operators';

export interface CaloricIntakeForm {
  birthdate: Date;
  heightInCm: number;
  weightInKg: number;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
}

@Component({
  selector: 'app-calculate-intake-form',
  templateUrl: './calculate-intake-form.component.html',
  styleUrls: ['./calculate-intake-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalculateIntakeFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CalculateIntakeFormComponent),
      multi: true,
    },
  ],
})
export class CalculateIntakeFormComponent
  implements OnInit, ControlValueAccessor, Validator
{
  constructor() {}

  public activityLevel = ActivityLevel;
  public goal = Goal;
  public gender = Gender;

  public formDefault: CaloricIntakeForm = {
    birthdate: new Date(),
    heightInCm: 170,
    weightInKg: 70,
    gender: Gender.male,
    goal: Goal.keep,
    activityLevel: ActivityLevel.active,
  };

  public caloricIntakeForm = new FormGroup({
    birthdate: new FormControl(this.formDefault.birthdate.toJSON(), {
      validators: [Validators.required],
    }),
    heightInCm: new FormControl(this.formDefault.heightInCm, {
      validators: [Validators.required],
    }),
    weightInKg: new FormControl(this.formDefault.weightInKg, {
      validators: [Validators.required],
    }),
    gender: new FormControl<Gender>(this.formDefault.gender, {
      validators: [Validators.required],
    }),
    goal: new FormControl<Goal>(this.formDefault.goal, { nonNullable: true }),
    activityLevel: new FormControl<ActivityLevel>(
      this.formDefault.activityLevel,
      {
        validators: [Validators.required],
      }
    ),
  });

  ngOnInit() {}

  registerOnChange(fn: any): void {
    this.caloricIntakeForm.valueChanges
      .pipe(startWith(this.formDefault))
      .subscribe((value) =>
        fn({
          ...value,
          birthdate: value.birthdate ? new Date(value.birthdate) : undefined,
        })
      );
  }

  registerOnTouched(fn: any): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    return this.caloricIntakeForm.valid
      ? null
      : { invalidForm: { valid: false } };
  }

  writeValue(obj: CaloricIntakeForm): void {
    if (obj) {
      this.caloricIntakeForm.patchValue(
        { ...obj, birthdate: obj.birthdate.toJSON() },
        {
          emitEvent: false,
        }
      );
    }
  }
}
