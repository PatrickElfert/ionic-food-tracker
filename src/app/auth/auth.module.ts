import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from "./features/signIn/sign-in.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { IonicModule } from "@ionic/angular";



@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonicModule
  ]
})
export class AuthModule { }
