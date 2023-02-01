import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { FoodCardComponent } from '../../../food-card/food-card.component';
import { HammerModule } from '@angular/platform-browser';
import { MacroHeaderComponent } from '../../../macro-header/macro-header.component';
import { IngredientSearchComponent } from '../../ui/ingredient-search/ingredient-search.component';
import { DiaryComponent } from '../diary/diary.component';
import { CalorieBarComponent } from '../../ui/calorie-bar/calorie-bar.component';
import { IngredientItemComponent } from "../../ui/ingredient-item/ingredient-item.component";
import { IngredientSearchItemComponent } from "../../ui/ingredient-search-item/ingredient-search-item.component";
import { AddIngredientComponent } from "../../ui/add-ingredient/add-ingredient.component";
import { MacroCardComponent } from "../../ui/macro-card/macro-card.component";

@NgModule({
  imports: [
    HammerModule,
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule
  ],
  exports: [],
  declarations: [
    Tab1Page,
    FoodCardComponent,
    IngredientItemComponent,
    IngredientSearchItemComponent,
    AddIngredientComponent,
    IngredientSearchComponent,
    DiaryComponent,
    CalorieBarComponent,
    MacroHeaderComponent,
    MacroCardComponent,
  ],
})
export class Tab1PageModule {}
