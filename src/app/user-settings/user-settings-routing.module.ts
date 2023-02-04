import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingsComponent } from './features/user-settings/user-settings.component';
import { CalorieSettingsComponent } from './features/calorie-settings/calorie-settings.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsComponent,
  },
  {
    path: 'calories',
    component: CalorieSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSettingsRoutingModule{}
