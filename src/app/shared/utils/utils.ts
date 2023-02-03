import {
  ActivityLevel,
  CaloricIntakeVariables,
  Goal,
} from '../interfaces/caloric-intake-variables';

// Type guards
export const isNotUndefinedOrNull = <T>(
  input: T | undefined | null
): input is T => input !== undefined || input !== null;


// Formulas
export const calculateCaloricIntake = (variables: CaloricIntakeVariables) => {
  const { activityLevel, goal } =
    variables;
  const activityFactor = getActivityFactor(activityLevel);
  const goalFactor = getGoalFactor(goal);
  const BMR = calculateBmr(variables);
  const bmrIncludingActivity = BMR * activityFactor;
  return Math.round((bmrIncludingActivity / 100) * (100 + goalFactor));
};

const getActivityFactor = (activityLevel: ActivityLevel) => {
  switch (activityLevel) {
    case ActivityLevel.sedentary:
    case ActivityLevel.lightlyActive:
      return 1.53;
    case ActivityLevel.active:
      return 1.76;
    case ActivityLevel.veryActive:
      return 2.25;
  }
};

const getGoalFactor = (goal: Goal) =>
  goal === Goal.loss ? -10 : goal === Goal.gain ? 10 : 0;


const W_FACTOR = 161;
const M_FACTOR = 5;

const calculateBmr = ({
  weightInKg,
  heightInCm,
  ageInYears,
  gender,
}: CaloricIntakeVariables) => (
    10 * weightInKg +
    6.25 * heightInCm -
    5 * ageInYears +
    (gender === 'MALE' ? M_FACTOR : W_FACTOR)
  );

