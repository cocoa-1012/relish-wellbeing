import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageReportPage } from './manage-report.page';

const routes: Routes = [
  {
    path: '',
    component: ManageReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageReportPageRoutingModule {}
