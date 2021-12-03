import { Component} from '@angular/core';
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
  constructor( public modalController: ModalController) {}

  public async presentModal(): Promise<void> {
   const modal = await this.modalController.create({
     component: IngredientSearchModalComponent,
   });
   return await modal.present();
  }

}
