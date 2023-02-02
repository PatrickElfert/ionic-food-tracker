import { CaloricIntakeVariables } from "../../onboarding/interfaces/caloric-intake-variables";

export interface User {
  email: string | null;
  userId: string;
}

export interface UserSettings {
  userId: string;
  caloricIntakeVariables?: CaloricIntakeVariables;
  fixedCalories?: number;
  mealCategories: string[];
}
