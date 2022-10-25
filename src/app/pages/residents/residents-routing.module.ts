import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResidentsPage } from './residents.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentsPage,
  },
  {
    path: ':id',
    loadChildren: () => import('./resident-detail/resident-detail.module').then( m => m.ResidentDetailPageModule)
  },
  {
    path: ':report_id/residential-report/:id',
    loadChildren: () => import('../reports/residential-report/residential-report.module').then(m => m.ResidentialReportPageModule)
  },
  {
    path: ':id/messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidentsPageRoutingModule {}
