import { FirestoreDataConverter } from '@firebase/firestore';
import { IntakeSource, UserSettings } from '../interfaces/user';
import { calculateCaloricIntake } from './calorie-formulas';

export const userSettingsConverter: FirestoreDataConverter<UserSettings> = {
  toFirestore: ({ caloricIntakeVariables, ...rest }: UserSettings) => ({
    ...rest,
    caloricIntakeVariables: caloricIntakeVariables
      ? {
          ...caloricIntakeVariables,
          birthdate: caloricIntakeVariables.birthdate.getTime(),
        }
      : undefined,
  }),
  fromFirestore: (snapshot, options) => {
    const { caloricIntakeVariables, ...rest } = snapshot.data(options);
    const patchedVariables = caloricIntakeVariables
      ? {
          ...caloricIntakeVariables,
          birthdate: new Date(caloricIntakeVariables.birthdate),
        }
      : undefined;
    return {
      ...rest,
      caloricIntakeVariables: patchedVariables,
      calories:
        rest.intakeSource === IntakeSource.calculated
          ? calculateCaloricIntake(patchedVariables)
          : rest.fixedCalories,
    } as UserSettings;
  },
};
