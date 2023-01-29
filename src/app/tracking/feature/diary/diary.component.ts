import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActionSheetController } from '@ionic/angular';
import { Ingredient } from '../../../interfaces/ingredient';
import { DiaryService } from '../../data-access/diary.service';
import { Meal } from '../../../interfaces/meal';
import { MealService } from '../../../meal.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiaryComponent implements OnInit {
  $vm = this.diaryService.diaryDay$.pipe(
    map((diaryDay) => ({ ...diaryDay })),
  );

  constructor(
    public diaryService: DiaryService,
    public mealService: MealService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  onDeleteIngredient(meal: Meal, ingredient: Ingredient) {
    this.mealService.update({
      id: meal.id,
      ingredients: meal.ingredients.filter((i) => i.id !== ingredient.id),
    });
  }

  routeToSearch() {
    this.router.navigate(['search'], { relativeTo: this.activatedRoute });
  }
}
