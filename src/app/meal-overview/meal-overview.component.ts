import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../meal.service';
import { ActionSheetController } from '@ionic/angular';
import { CalorieBarService } from '../calorie-bar.service';
import { Meal } from '../meal-card/meal-card.component';
import { addDays, format } from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meal-overview',
  templateUrl: './meal-overview.component.html',
  styleUrls: ['./meal-overview.component.sass'],
})
export class MealOverviewComponent implements OnInit {
  public currentDateFormatted: string | undefined;
  public meals: Meal[] | undefined;
  private mealsSubscription: Subscription | undefined;
  private currentDate!: Date;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mealService: MealService,
    private actionSheetController: ActionSheetController,
    private changeDetector: ChangeDetectorRef,
    private calorieBarService: CalorieBarService
  ) {}

  ngOnInit() {
    this.subscribeToCurrentTrackerDate();
    this.mealService.selectedDate?.next(new Date());
  }

  public navigate() {
    this.router.navigate(['meal'], { relativeTo: this.activatedRoute });
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
            this.calorieBarService.reduceCalories(meal.calories);
            await this.mealService.removeMeal(meal.id);
          },
        },
        {
          text: 'Edit',
          icon: 'pencil-outline',
          handler: () => {
            this.router.navigate(['meal', meal.id], {
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
    this.mealService.selectedDate?.next(addDays(this.currentDate, 1));
  }

  public previousDay(): void {
    this.mealService.selectedDate?.next(addDays(this.currentDate, -1));
  }

  private subscribeToCurrentTrackerDate() {
    this.mealService.selectedDate.subscribe((date) => {
      if (date) {
        this.subscribeToMealsForCurrentTrackerDate(date);
        this.currentDate = date;
        this.currentDateFormatted = format(date, 'cccc');
      }
    });
  }

  private subscribeToMealsForCurrentTrackerDate(date: Date) {
    if (this.mealsSubscription) {
      this.mealsSubscription.unsubscribe();
    }
    this.mealsSubscription = this.mealService
      .subscribeToMeals(date)
      .subscribe((meals) => {
        this.meals = meals;
        this.updateCurrentCalories(meals);
      });
  }

  private updateCurrentCalories(meals: Meal[]) {
    this.calorieBarService.currentCalories.next(
      meals.reduce((acc, m) => {
        acc += m.calories;
        return acc;
      }, 0)
    );
    this.meals = meals;
  }
}