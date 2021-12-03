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
import {MealOverviewComponent} from '../meal-overview/meal-overview.component';
import {MealCardComponent} from '../meal-card/meal-card.component';

@NgModule({
  imports: [
    HammerModule,
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
  ],
  declarations: [Tab1Page, FoodCardComponent, MealComponent, IngredientSearchModalComponent, MealOverviewComponent, MealCardComponent]
})
export class Tab1PageModule {}
