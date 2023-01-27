import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../meal.service';
import { ActionSheetController } from '@ionic/angular';
import { Meal } from '../interfaces/meal';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { addDays } from 'date-fns/esm';
import { flatMap } from 'lodash';
import { DiaryService } from '../diary.service';

@Component({
  selector: 'app-meal-overview',
  templateUrl: './meal-overview.component.html',
  styleUrls: ['./meal-overview.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealOverviewComponent implements OnInit {


  $vm = combineLatest([
    this.mealService.selectedDateFormatted$,
  ]).pipe(
    map(([meals, date]) => ({
      selectedDate: date,
      ingredients: flatMap(meals, (meal) => meal.ingredients),
    }))
  );


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mealService: MealService,
    private diaryService: DiaryService,
  ) {}

  ngOnInit(): void {}
}
