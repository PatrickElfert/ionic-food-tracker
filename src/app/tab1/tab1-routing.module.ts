import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MealComponent} from '../meal/meal.component';
import {MealOverviewComponent} from '../meal-overview/meal-overview.component';

const routes: Routes = [
  {
    path: '',
    component: MealOverviewComponent,
  },
  {
    path: 'meal',
    component: MealComponent
  },
  {
    path: 'meal/:id',
    component: MealComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
