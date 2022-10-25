import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsPage } from './reports.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
  },
  {
    path: ':id',
    loadChildren: () => import('./report-detail/report-detail.module').then( m => m.ReportDetailPageModule)
  },
  {
    path: ':report_id/residential-report/:id',
    loadChildren: () => import('./residential-report/residential-report.module').then( m => m.ResidentialReportPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsPageRoutingModule {}
