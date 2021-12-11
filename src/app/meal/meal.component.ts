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

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.sass'],
})
export class MealComponent implements OnInit, AfterViewChecked {
  @ViewChild('input', { static: false }) ionInput:
    | { setFocus: () => void }
    | undefined;
  selectedIngredients: Ingredient[] = [];
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
    this.activatedRoute.paramMap.subscribe((params) => {
      this.meal = this.mealService.meals.find(
        (m) => m.name === params.get('id')
      );
      this.name = this.meal ? this.meal.name : '';
      this.selectedIngredients = this.meal?.ingredients ?? [];
    });
  }

  public async presentModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: IngredientSearchModalComponent,
    });
    await modal.present();
    this.selectedIngredients.push(
      ...((await modal.onWillDismiss()).data as Ingredient[])
    );
  }

  public deleteIngredient(index: number): void {
    this.calorieBarService.reduceCalories(
      this.selectedIngredients[index].calories
    );
    this.selectedIngredients.splice(index, 1);
    this.changedDetector.detectChanges();
  }

  public safeMeal(): void {
    if (this.meal) {
      this.meal = new Meal(this.selectedIngredients, this.meal.name);
    }
    if (this.selectedIngredients.length > 0) {
      this.mealService.meals.push(
        new Meal(this.selectedIngredients, this.name)
      );
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
