import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentDetailPage } from './resident-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentDetailPageRoutingModule {}
