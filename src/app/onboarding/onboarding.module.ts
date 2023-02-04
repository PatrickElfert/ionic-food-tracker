import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OnboardingRoutingModule} from './onboarding-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {IntakeComponent} from './features/intake/intake.component';
import {WelcomeComponent} from './features/welcome/welcome.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnboardingRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [],
  declarations: [IntakeComponent, WelcomeComponent],
})
export class OnboardingModule{}
