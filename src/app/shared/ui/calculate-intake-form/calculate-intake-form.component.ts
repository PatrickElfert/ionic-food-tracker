import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  OnInit,
} from '@angular/core';
import {
  ActivityLevel,
  Gender,
  Goal,
} from '../../interfaces/caloric-intake-variables';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { KeyValuePipe, NgForOf } from '@angular/common';

interface CaloricIntakeFormDefinition {
  birthdate: FormControl<string>;
  heightInCm: FormControl<number>;
  weightInKg: FormControl<number>;
  gender: FormControl<Gender>;
  goal: FormControl<Goal>;
  activityLevel: FormControl<ActivityLevel>;
}

type CaloricIntakeFormValues = {
  [key in keyof CaloricIntakeFormDefinition]: CaloricIntakeFormDefinition[key]['value'];
};

export interface CaloricIntakeForm extends Omit<CaloricIntakeFormValues, 'birthdate'> {
  birthdate: Date;
}

@Component({
  selector: 'app-calculate-intake-form',
  templateUrl: './calculate-intake-form.component.html',
  styleUrls: ['./calculate-intake-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalculateIntakeFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CalculateIntakeFormComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IonicModule,
    NgForOf,
    KeyValuePipe
  ],
  standalone: true
})
export class CalculateIntakeFormComponent
  implements OnInit, ControlValueAccessor, Validator
{
  constructor() {}

  public activityLevel = ActivityLevel;
  public goal = Goal;
  public gender = Gender;

  public formDefault: CaloricIntakeFormValues = {
    birthdate: new Date().toString(),
    heightInCm: 170,
    weightInKg: 70,
    gender: Gender.male,
    goal: Goal.keep,
    activityLevel: ActivityLevel.active,
  };

  public caloricIntakeForm = new FormGroup<CaloricIntakeFormDefinition>({
    birthdate: new FormControl(this.formDefault.birthdate, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    heightInCm: new FormControl(this.formDefault.heightInCm, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    weightInKg: new FormControl(this.formDefault.weightInKg, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    gender: new FormControl<Gender>(this.formDefault.gender, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    goal: new FormControl<Goal>(this.formDefault.goal, { nonNullable: true }),
    activityLevel: new FormControl<ActivityLevel>(
      this.formDefault.activityLevel,
      {
        nonNullable: true,
        validators: [Validators.required],
      }
    ),
  });

  ngOnInit() {}

  registerOnChange(fn: (input: Partial<CaloricIntakeForm>) => void): void {
    this.caloricIntakeForm.valueChanges.subscribe((value) => {
      fn({
        ...value,
        birthdate: value.birthdate ? new Date(value.birthdate) : undefined,
      });
    });
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
