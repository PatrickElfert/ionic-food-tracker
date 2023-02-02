import { NgModule } from '@angular/core';
import {redirectUnauthorizedTo } from "@angular/fire/auth-guard";
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./auth.guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);


const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('../../../auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('../../../onboarding/onboarding.module').then((m) => m.OnboardingModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
