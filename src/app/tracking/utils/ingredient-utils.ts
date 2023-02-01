import { Macros } from "../interfaces/macros";

export const calculateMacros = ({protein, fat, carbs}: Macros, oldAmount: number, newAmount: number) => ({
  protein: (protein / oldAmount) * newAmount,
    fat: (fat / oldAmount) * newAmount,
    carbs: (carbs / oldAmount) * newAmount,
});

export const calculateCalories = (macros: Macros) => macros.carbs * 4 + macros.fat * 9 + macros.protein * 4;
