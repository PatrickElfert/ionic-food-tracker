import {CaloricIntakeVariables} from '../onboarding/onboarding.service';

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
