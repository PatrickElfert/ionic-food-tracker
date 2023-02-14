import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { IntakeComponent } from './features/intake/intake.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'intake/:knowsIntake',
    component: IntakeComponent,
  },
];
