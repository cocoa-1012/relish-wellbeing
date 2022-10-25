import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [IntroGuard, AutoLoginGuard] // Check if we should show the introduction or forward to inside
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'manage-resident',
    loadChildren: () => import('./modals/residents/manage-resident/manage-resident.module').then( m => m.ManageResidentPageModule)
  },
  {
    path: 'pal',
    loadChildren: () => import('./modals/pal/pal.module').then( m => m.PalPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'manage-report',
    loadChildren: () => import('./modals/reports/manage-report/manage-report.module').then( m => m.ManageReportPageModule)
  },
  {
    path: 'choose-activity',
    loadChildren: () => import('./modals/choose-activity/choose-activity.module').then( m => m.ChooseActivityPageModule)
  },
  {
    path: 'email-report',
    loadChildren: () => import('./modals/email-report/email-report.module').then( m => m.EmailReportPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
