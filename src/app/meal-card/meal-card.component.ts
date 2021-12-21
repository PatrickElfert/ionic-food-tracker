import { Component, Input, OnChanges } from '@angular/core';
import { Ingredient } from '../ingredient.service';
import { Macros } from '../macros';

export class Meal {
  public macros: Macros;
  public calories: number;

  constructor(
    public ingredients: Ingredient[],
    public name: string,
    public id: string,
    public date: string
  ) {
    this.macros = this.ingredients.reduce(
      (acc, i) => {
        acc.protein += i.macros.protein;
        acc.fat += i.macros.fat;
        acc.carbs += i.macros.carbs;
        return acc;
      },
      { protein: 0, fat: 0, carbs: 0 }
    );
    this.calories =
      this.macros.carbs * 4 + this.macros.fat * 9 + this.macros.protein * 4;
  }
}

export type MacroPercentages = { p: number; f: number; c: number };

@Component({
  selector: 'app-meal-card',
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.sass'],
})
export class MealCardComponent implements OnChanges {
  @Input() meal!: Meal;
  public macroStyle: MacroPercentages | undefined;
  constructor() {}

  ngOnChanges(): void {
    const { protein, fat, carbs } = this.meal.macros;
    const allMacros = protein + fat + carbs;
    this.macroStyle =
      allMacros === 0
        ? { p: 0, c: 0, f: 0 }
        : {
            p: protein / allMacros,
            f: fat / allMacros,
            c: carbs / allMacros,
          };
  }
}
