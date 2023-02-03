import { CaloricIntakeVariables, CaloricIntakeVariablesPayload } from "./caloric-intake-variables";

export interface User {
  email: string | null;
  userId: string;
}

export interface UserSettings {
  userId: string;
  caloricIntakeVariables: CaloricIntakeVariables | undefined;
  fixedCalories: number | undefined;
  mealCategories: string[];
}

export interface UserSettingsPayload {
  userId: string;
  caloricIntakeVariables: CaloricIntakeVariablesPayload | undefined;
  fixedCalories: number | undefined;
  mealCategories: string[];
}
