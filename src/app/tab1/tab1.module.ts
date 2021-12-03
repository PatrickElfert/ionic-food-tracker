import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import {FoodCardComponent} from '../food-card/food-card.component';
import {HammerModule} from '@angular/platform-browser';
import {MealComponent} from '../meal/meal.component';
import {IngredientSearchModalComponent} from '../ingredient-search-modal/ingredient-search-modal.component';

@NgModule({
  imports: [
    HammerModule,
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
  ],
  declarations: [Tab1Page, FoodCardComponent, MealComponent, IngredientSearchModalComponent]
})
export class Tab1PageModule {}
