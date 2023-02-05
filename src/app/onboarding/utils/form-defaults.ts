import { ActivityLevel, Gender, Goal } from '../../shared/interfaces/caloric-intake-variables';
import { CaloricIntakeForm } from '../../shared/ui/calculate-intake-form/calculate-intake-form.component';

export const intakeFormDefault: CaloricIntakeForm = {
  birthdate: new Date(),
  heightInCm: 180,
  weightInKg: 80,
  gender: Gender.male,
  goal: Goal.keep,
  activityLevel: ActivityLevel.active,
}
