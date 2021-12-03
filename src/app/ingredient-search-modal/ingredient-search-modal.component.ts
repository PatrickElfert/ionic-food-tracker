import { Component, OnInit } from '@angular/core';
import {Ingredient, IngredientService} from '../ingredient.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-ingredient-search-modal',
  templateUrl: './ingredient-search-modal.component.html',
  styleUrls: ['./ingredient-search-modal.component.sass'],
})
export class IngredientSearchModalComponent implements OnInit {
  private ingredientSearchResult: Ingredient[] | undefined;

  constructor(private ingredientService: IngredientService, private modalController: ModalController) { }

  public async onSearchChanged($event: any): Promise<void> {
    this.ingredientSearchResult = await this.ingredientService.loadIngredients($event.target.value as string);
  }

  ngOnInit() {
  };

  public async dismissModal(): Promise<void> {
    await this.modalController.dismiss();
  }
}
