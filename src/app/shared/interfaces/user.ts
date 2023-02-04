import { CaloricIntakeVariables, CaloricIntakeVariablesPayload } from './caloric-intake-variables';

export interface User {
  email: string | null;
  userId: string;
}

export interface UserSettings {
  caloricIntakeVariables: CaloricIntakeVariables | undefined;
  fixedCalories: number | undefined;
  intakeSource: IntakeSource;
  mealCategories: string[];
}

export interface UserSettingsPayload {
  caloricIntakeVariables: CaloricIntakeVariablesPayload | undefined;
  fixedCalories: number | undefined;
  intakeSource: IntakeSource;
  mealCategories: string[];
}

export enum IntakeSource {
  fixed = 'fixed',
  calculated = 'calculated',
}
