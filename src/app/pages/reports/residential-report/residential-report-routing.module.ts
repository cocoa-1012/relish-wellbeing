import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentialReportPage } from './residential-report.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentialReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentialReportPageRoutingModule {}
