export interface CaloricIntakeVariables {
  ageInYears: number;
  weightInKg: number;
  heightInCm: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export enum ActivityLevel {
  sedentary = 'SEDENTARY',
  lightlyActive= 'LIGHTLY ACTIVE',
  active = 'ACTIVE',
  veryActive= 'VERY ACTIVE',
}

export enum Goal {
  loss = 'LOSS',
  gain = 'GAIN',
  keep = 'KEEP',
}

export enum Gender {
  male = 'MALE',
  female ='FEMALE'
}
