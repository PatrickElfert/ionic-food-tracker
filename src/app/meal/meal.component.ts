import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../ingredient.service';
import { IonInput, ModalController } from '@ionic/angular';
import { IngredientSearchModalComponent } from '../ingredient-search-modal/ingredient-search-modal.component';
import { MealService } from '../meal.service';
import { Meal } from '../meal-card/meal-card.component';
import { ActivatedRoute } from '@angular/router';
import { CalorieBarService } from '../calorie-bar.service';
import { v4 } from 'uuid';
import { updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.sass'],
})
export class MealComponent implements OnInit, AfterViewChecked {
  @ViewChild('input', { static: false }) ionInput:
    | { setFocus: () => void }
    | undefined;
  meal: Meal | undefined;
  name = '';
  private needsFocus = false;
  constructor(
    public modalController: ModalController,
    private calorieBarService: CalorieBarService,
    private changedDetector: ChangeDetectorRef,
    private mealService: MealService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        this.mealService.subscribeToMeal(id).subscribe((m) => {
          console.log('new meal');
          this.meal = m;
        });
      } else {
        this.meal = new Meal([], '', v4());
      }
    });
  }

  public async presentModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: IngredientSearchModalComponent,
    });
    await modal.present();
    this.meal?.ingredients.push(
      ...((await modal.onWillDismiss()).data as Ingredient[])
    );
    if (this.meal) {
      console.log('update meal');
      await this.mealService.updateMeal(this.meal);
    }
  }

  public async deleteIngredient(index: number): Promise<void> {
    if (this.meal) {
      this.meal.ingredients.splice(index, 1);
      await this.mealService.updateMeal(this.meal);
    }
  }

  ionViewDidEnter() {
    this.needsFocus = true;
  }

  ngAfterViewChecked(): void {
    if (this.needsFocus) {
      this.ionInput?.setFocus();
      this.needsFocus = false;
      this.changedDetector.detectChanges();
    }
  }
}
