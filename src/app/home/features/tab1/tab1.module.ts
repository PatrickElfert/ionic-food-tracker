import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { HammerModule } from '@angular/platform-browser';
import { IngredientSearchComponent } from '../../../tracking/feature/ingredient-search/ingredient-search.component';
import { DiaryComponent } from '../../../tracking/feature/diary/diary.component';
import { CalorieBarComponent } from '../../../tracking/ui/calorie-bar/calorie-bar.component';
import { IngredientItemComponent } from '../../../tracking/ui/ingredient-item/ingredient-item.component';
import { IngredientSearchItemComponent } from '../../../tracking/ui/ingredient-search-item/ingredient-search-item.component';
import { AddIngredientComponent } from '../../../tracking/ui/add-ingredient/add-ingredient.component';
import { MacroCardComponent } from '../../../tracking/ui/macro-card/macro-card.component';

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
    IngredientItemComponent,
    IngredientSearchItemComponent,
    AddIngredientComponent,
    IngredientSearchComponent,
    DiaryComponent,
    CalorieBarComponent,
    MacroCardComponent,
  ],
})
export class Tab1PageModule {}
