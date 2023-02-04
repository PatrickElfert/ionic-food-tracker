import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsComponent } from './features/user-settings/user-settings.component';
import { CalorieSettingsComponent } from './features/calorie-settings/calorie-settings.component';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [UserSettingsComponent, CalorieSettingsComponent],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    IonicModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserSettingsModule { }
