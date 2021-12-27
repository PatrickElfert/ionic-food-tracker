import { Component, Input, OnChanges } from '@angular/core';
import { Meal } from '../interfaces/meal';

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
