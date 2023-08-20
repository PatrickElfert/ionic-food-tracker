import { SignInComponent } from './features/signIn/sign-in.component';
import { Routes } from '@angular/router';
import { SignUpComponent } from './features/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    component: SignUpComponent,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
];
