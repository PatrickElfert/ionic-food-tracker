import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../meal.service';
import { ActionSheetController } from '@ionic/angular';
import { CalorieBarService } from '../calorie-bar.service';
import { Meal } from '../meal-card/meal-card.component';

@Component({
  selector: 'app-meal-overview',
  templateUrl: './meal-overview.component.html',
  styleUrls: ['./meal-overview.component.sass'],
})
export class MealOverviewComponent implements OnInit {
  today = new Date().toLocaleDateString();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mealService: MealService,
    private actionSheetController: ActionSheetController,
    private changeDetector: ChangeDetectorRef,
    private calorieBarService: CalorieBarService
  ) {}

  ngOnInit() {}

  navigate() {
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
}
