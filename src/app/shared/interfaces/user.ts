import { CaloricIntakeVariables } from './caloric-intake-variables';

export interface User {
  email: string | null;
  userId: string;
}

export interface UserSettings {
  caloricIntakeVariables: CaloricIntakeVariables | undefined;
  fixedCalories: number | undefined;
  calories: number | undefined;
  intakeSource: IntakeSource;
  mealCategories: string[];
}

export enum IntakeSource {
  fixed = 'fixed',
  calculated = 'calculated',
}
