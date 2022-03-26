import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../meal.service';
import { ActionSheetController } from '@ionic/angular';
import { Meal } from '../interfaces/meal';
import { v4 } from 'uuid';
import { map, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import {addDays, format} from 'date-fns/esm';

@Component({
  selector: 'app-meal-overview',
  templateUrl: './meal-overview.component.html',
  styleUrls: ['./meal-overview.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealOverviewComponent {
  $vm = combineLatest([
    this.mealService.mealsAtSelectedDate$,
    this.mealService.selectedDateFormatted$,
  ]).pipe(
    map(([meals, date]) => ({ selectedDate: date, mealsAtSelectedDate: meals }))
  );

  private currentDate: Date = new Date();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mealService: MealService,
    private actionSheetController: ActionSheetController,
  ) {}

  ionViewDidEnter() {}

  public async onCreateNewMeal() {
    const id = v4();
    this.mealService.setMeal(
      new Meal(
        [],
        '',
        id,
        format(
          this.currentDate,
          'MM/dd/yyyy'
        ).toString()
      )
    );
    await this.router.navigate(['meal', id ], { relativeTo: this.activatedRoute });
  }

  public async openActionSheet(index: number, meal: Meal): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Meal',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: async () => {
            await this.mealService.removeMeal(meal.id);
          },
        },
        {
          text: 'Edit',
          icon: 'pencil-outline',
          handler: async () => {
            await this.router.navigate(['meal', meal.id], {
              relativeTo: this.activatedRoute,
            });
          },
        },
        { text: 'Cancel', role: 'cancel', icon: 'close' },
      ],
    });
    await actionSheet.present();
  }
  public nextDay(): void {
    this.currentDate = addDays(this.currentDate, 1);
    this.mealService.setSelectedDate(this.currentDate);
  }

  public previousDay(): void {
    this.currentDate = addDays(this.currentDate, -1);
    this.mealService.setSelectedDate(this.currentDate);
  }
}
