import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiaryComponent } from '../diary/diary.component';
import { IngredientSearchComponent } from "../../ui/ingredient-search/ingredient-search.component";

const routes: Routes = [
  {
    path: '',
    component: DiaryComponent,
  },
  {path: 'search', component: IngredientSearchComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
