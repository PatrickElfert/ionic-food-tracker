import {ChangeDetectorRef, Component} from '@angular/core';
import {Ingredient} from '../ingredient.service';
import {ModalController} from '@ionic/angular';
import {IngredientSearchModalComponent} from '../ingredient-search-modal/ingredient-search-modal.component';
import {MealService} from '../meal.service';
import {Meal} from '../meal-card/meal-card.component';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.sass'],
})
export class MealComponent {
  selectedIngredients: Ingredient[] = [];
  constructor( public modalController: ModalController, private changedDetector: ChangeDetectorRef, private mealService: MealService) {}

  public async presentModal(): Promise<void> {
   const modal = await this.modalController.create({
     component: IngredientSearchModalComponent,
   });
   await modal.present();
   this.selectedIngredients = (await modal.onWillDismiss()).data as Ingredient[];
  }

  public deleteIngredient(index: number): void {
   this.selectedIngredients.splice(index,1);
   this.changedDetector.detectChanges();
  }

  public addMeal(): void {
    if(this.selectedIngredients.length > 0) {
      this.mealService.meals.push(new Meal(this.selectedIngredients, 'Great Meal'));
    }
  }
}
