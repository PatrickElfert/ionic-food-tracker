import { Component, OnInit } from '@angular/core';
import {Ingredient, IngredientService} from '../ingredient.service';
import {ModalController} from '@ionic/angular';
import {CalorieBarService} from '../calorie-bar.service';

@Component({
  selector: 'app-ingredient-search-modal',
  templateUrl: './ingredient-search-modal.component.html',
  styleUrls: ['./ingredient-search-modal.component.sass'],
})
export class IngredientSearchModalComponent implements OnInit {
  private ingredientSearchResult: Ingredient[] = [];
  private selectedIngredients: Ingredient[] = [];

  constructor(private calorieBarService: CalorieBarService, private ingredientService: IngredientService, private modalController: ModalController) { }

  public async onSearchChanged($event: any): Promise<void> {
    this.ingredientSearchResult = (await this.ingredientService.loadIngredients($event.target.value as string))
      .map(i => ({...i, selected: false}));
  }

  ngOnInit() {};

  public async dismissModal(): Promise<void> {
    await this.modalController.dismiss(this.selectedIngredients);
  }

  selectionChanged($event: boolean, ingredient: Ingredient ) {
   if($event) {
     this.selectedIngredients.push(ingredient);
     this.calorieBarService.addCalories(ingredient.calories);
   } else {
     this.selectedIngredients.splice(this.selectedIngredients.findIndex(s => s.name === ingredient.name),1);
     this.calorieBarService.reduceCalories(ingredient.calories);
   }
  }
}
