import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { UserSettingsComponent } from '../../../user-settings/features/user-settings/user-settings.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
  ],
  declarations: [UserSettingsComponent]
})
export class Tab2PageModule {}
