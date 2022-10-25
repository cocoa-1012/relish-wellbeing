import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'activity-finder',
        loadChildren: () => import('../pages/activity-finder/activity-finder.module').then(m => m.ActivityFinderPageModule)
      },
      {
        path: 'my-activities',
        loadChildren: () => import('../pages/my-activities/my-activities.module').then(m => m.MyActivitiesPageModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('../pages/reports/reports.module').then(m => m.ReportsPageModule)
      },
      {
        path: 'residents',
        loadChildren: () => import('../pages/residents/residents.module').then(m => m.ResidentsPageModule)
      },
      {
        path: 'relatives',
        loadChildren: () => import('../pages/relatives/relatives.module').then(m => m.RelativesPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
