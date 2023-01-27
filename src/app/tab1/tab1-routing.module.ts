import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MealOverviewComponent} from '../meal-overview/meal-overview.component';

const routes: Routes = [
  {
    path: '',
    component: MealOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
