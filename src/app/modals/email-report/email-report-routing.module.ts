import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailReportPage } from './email-report.page';


const routes: Routes = [
  {
    path: '',
    component: EmailReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailReportPageRoutingModule {}
