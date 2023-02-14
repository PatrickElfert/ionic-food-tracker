import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../tabs/tabs.routing').then((m) => m.routes),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../../../auth/auth.routing').then((m) => m.routes),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('../../../onboarding/onboarding.routing').then((m) => m.routes),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
