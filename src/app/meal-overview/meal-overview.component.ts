import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { DiaryService } from '../diary.service';
import { MealService } from '../meal.service';
import { Ingredient } from '../interfaces/ingredient';
import { Meal } from '../interfaces/meal';

@Component({
  selector: 'app-meal-overview',
  templateUrl: './meal-overview.component.html',
  styleUrls: ['./meal-overview.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealOverviewComponent implements OnInit {
  $vm = this.diaryService.diaryDay$.pipe(
    map((diaryDay) => ({ ...diaryDay })),
  );

  constructor(
    public diaryService: DiaryService,
    public mealService: MealService
  ) {}

  ngOnInit(): void {}

  // Todo maybe move these to meal service since the overview component should not need to be edited if an ingredient on a meal needs to be updated
  onUpdateIngredients(ingredients: Ingredient[]): void {
    console.log(ingredients);
  }

  onDeleteIngredient(meal: Meal, ingredient: Ingredient) {
    this.mealService.update({
      id: meal.id,
      ingredients: meal.ingredients.filter((i) => i.id !== ingredient.id),
    });
  }

  onUpdateIngredient(meal: Meal, ingredient: Ingredient) {
    this.mealService.update({
      id: meal.id,
      ingredients: meal.ingredients.map((i) =>
        i.id === ingredient.id ? ingredient : i
      ),
    });
  }
}
