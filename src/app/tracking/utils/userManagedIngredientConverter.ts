import { FirestoreDataConverter } from '@firebase/firestore';
import { IntakeSource, UserSettings } from '../../shared/interfaces/user';
import { calculateCaloricIntake } from '../../shared/utils/calorie-formulas';
import { Ingredient } from '../interfaces/ingredient';
import { ExternalIngredient } from '../interfaces/external-ingredient';

export const userManagedIngredientConverter: FirestoreDataConverter<ExternalIngredient> = {
  toFirestore: (ingredient: ExternalIngredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    brand: ingredient.brand,
    macros: ingredient.macros,
    defaultAmount: ingredient.defaultAmount,
  }),
  fromFirestore: (snapshot, options) => {
    const ingredientPayload = snapshot.data(options);
    return new ExternalIngredient(
      ingredientPayload.id,
      ingredientPayload.name,
      ingredientPayload.brand,
      ingredientPayload.macros,
      ingredientPayload.currentAmount,
    );
  },
};
