export interface CaloricIntakeVariables {
  ageInYears: number;
  weightInKg: number;
  heightInCm: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export type ActivityLevel =  'NOT ACTIVE' | 'LIGHTLY ACTIVE' | 'ACTIVE' | 'VERY ACTIVE';
export type Goal = 'LOSS' | 'GAIN' | 'KEEP';
export type Gender = 'MALE' | 'FEMALE';
