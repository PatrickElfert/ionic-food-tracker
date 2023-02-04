import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () =>
          import('../../../tracking/tracking.module').then(
            (m) => m.TrackingModule
          ),
      },
      {
        path: 'tab2',
        loadChildren: () =>
          import('../../../user-settings/user-settings.module').then(
            (m) => m.UserSettingsModule
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {
  constructor() {}
}
