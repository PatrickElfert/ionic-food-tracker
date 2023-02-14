import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () =>
          import('../../../tracking/tracking.routing').then((m) => m.routes),
      },
      {
        path: 'tab2',
        loadChildren: () =>
          import('../../../user-settings/user-settings.routing').then(
            (m) => m.routes
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];

