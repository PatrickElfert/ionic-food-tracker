import { Component, OnInit } from '@angular/core';
import {Ingredient, IngredientService} from '../ingredient.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-ingredient-search-modal',
  templateUrl: './ingredient-search-modal.component.html',
  styleUrls: ['./ingredient-search-modal.component.sass'],
})
export class IngredientSearchModalComponent implements OnInit {
  private ingredientSearchResult: (Ingredient & {selected: boolean})[] = [];

  constructor(private ingredientService: IngredientService, private modalController: ModalController) { }

  public async onSearchChanged($event: any): Promise<void> {
    this.ingredientSearchResult = (await this.ingredientService.loadIngredients($event.target.value as string))
      .map(i => ({...i, selected: false}));
  }

  ngOnInit() {};

  public async dismissModal(): Promise<void> {
    await this.modalController.dismiss(this.ingredientSearchResult.filter(i => i.selected));
  }
}
