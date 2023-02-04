import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculateIntakeFormComponent } from './ui/calculate-intake-form/calculate-intake-form.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CalculateIntakeFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [CalculateIntakeFormComponent]
})
export class SharedModule { }
