import {Component, Input, OnInit} from '@angular/core';
import {Ingredient} from '../ingredient.service';
import {Macros} from '../macros';

export class Meal {
  public macros: Macros;
  public calories: number;

  constructor(public ingredients: Ingredient[], public name: string) {
    this.macros = this.ingredients.reduce((acc, i) =>
    {acc.protein += i.macros.protein; acc.fat += i.macros.fat; acc.carbs += i.macros.carbs; return acc;}
      ,{protein: 0, fat: 0, carbs: 0});
    this.calories = this.macros.carbs * 4 + this.macros.fat * 9 + this.macros.protein * 4;
  }
}

@Component({
  selector: 'app-meal-card',
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.sass'],
})
export class MealCardComponent implements OnInit {

  @Input() meal: Meal;
  constructor() {}
  ngOnInit() {}
}
