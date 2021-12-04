import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import {CalorieBarComponent} from '../calorie-bar/calorie-bar.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  exports: [
    CalorieBarComponent
  ],
  declarations: [TabsPage, CalorieBarComponent]
})
export class TabsPageModule {}
