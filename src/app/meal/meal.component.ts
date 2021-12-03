import {ChangeDetectorRef, Component} from '@angular/core';
import {Ingredient} from '../ingredient.service';
import {ModalController} from '@ionic/angular';
import {IngredientSearchModalComponent} from '../ingredient-search-modal/ingredient-search-modal.component';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.sass'],
})
export class MealComponent {
  selectedIngredients: Ingredient[] = [];
  constructor( public modalController: ModalController, private changedDetector: ChangeDetectorRef) {}

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
}
