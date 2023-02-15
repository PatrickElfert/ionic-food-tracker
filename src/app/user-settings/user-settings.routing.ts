import { Routes } from '@angular/router';
import { UserSettingsComponent } from './features/user-settings/user-settings.component';
import { CalorieSettingsComponent } from './features/calorie-settings/calorie-settings.component';
import { UserSettingsResolver } from '../onboarding/utils/user-settings.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        component: UserSettingsComponent,
      },
      {
        path: 'calories',
        component: CalorieSettingsComponent,
        resolve: {userSettings: UserSettingsResolver}
      },
    ]
  },
];

