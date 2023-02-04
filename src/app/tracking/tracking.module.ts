import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingRoutingModule } from './tracking-routing.module';
import { IngredientSearchComponent } from './feature/ingredient-search/ingredient-search.component';
import { DiaryComponent } from './feature/diary/diary.component';
import { AddIngredientComponent } from './ui/add-ingredient/add-ingredient.component';
import { CalorieBarComponent } from './ui/calorie-bar/calorie-bar.component';
import { IngredientItemComponent } from './ui/ingredient-item/ingredient-item.component';
import { IngredientSearchItemComponent } from './ui/ingredient-search-item/ingredient-search-item.component';
import { MacroCardComponent } from './ui/macro-card/macro-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    IngredientSearchComponent,
    DiaryComponent,
    AddIngredientComponent,
    CalorieBarComponent,
    IngredientItemComponent,
    IngredientSearchItemComponent,
    MacroCardComponent,
  ],
  imports: [
    CommonModule,
    TrackingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
})
export class TrackingModule {}
