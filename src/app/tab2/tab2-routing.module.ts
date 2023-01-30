import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { UserSettingsComponent } from "../user-settings/features/user-settings/user-settings.component";

const routes: Routes = [
  {
    path: '',
    component: UserSettingsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
