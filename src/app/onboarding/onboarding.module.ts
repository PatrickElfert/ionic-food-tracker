import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OnboardingRoutingModule} from './onboarding-routing.module';
import {FormsModule} from '@angular/forms';
import {IntakeComponent} from './intake/intake.component';
import {WelcomeComponent} from './welcome/welcome.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnboardingRoutingModule,
  ],
  exports: [],
  declarations: [IntakeComponent, WelcomeComponent],
})
export class OnboardingModule{}
