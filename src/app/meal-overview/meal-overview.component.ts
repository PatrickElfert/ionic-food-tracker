import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MealService} from '../meal.service';
import {ActionSheetController} from '@ionic/angular';
import {CalorieBarService} from '../calorie-bar.service';

@Component({
  selector: 'app-meal-overview',
  templateUrl: './meal-overview.component.html',
  styleUrls: ['./meal-overview.component.sass'],
})
export class MealOverviewComponent implements OnInit {
  today = new Date().toLocaleDateString();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private mealService: MealService,
              private actionSheetController: ActionSheetController,
              private changeDetector: ChangeDetectorRef,
              private calorieBarService: CalorieBarService
              ) { }

  ngOnInit() {}

  navigate() {
      this.router.navigate(['meal'], {relativeTo: this.activatedRoute });
  }

  public async openActionSheet(index: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
     header: 'Meal',
      buttons: [
        {text: 'Delete', role: 'destructive', icon: 'trash', handler: () => {
            this.calorieBarService.reduceCalories(this.mealService.meals[index].calories);
            this.mealService.meals.splice(index,1);
            this.changeDetector.detectChanges();
          }},
        {text: 'Edit', icon: 'pencil-outline', handler: () => {
          this.router.navigate(['meal', this.mealService.meals[index].name], {relativeTo: this.activatedRoute});
          }},
        {text: 'Cancel', role: 'cancel', icon: 'close'}
      ]
    });
    await actionSheet.present();
  }
}
