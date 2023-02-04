import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiaryComponent } from './feature/diary/diary.component';
import { IngredientSearchComponent } from './feature/ingredient-search/ingredient-search.component';

const routes: Routes = [
  {
    path: '',
    component: DiaryComponent,
  },
  {path: 'search', component: IngredientSearchComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackingRoutingModule{}
