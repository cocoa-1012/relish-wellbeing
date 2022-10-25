import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageResidentPage } from './manage-resident.page';

const routes: Routes = [
  {
    path: '',
    component: ManageResidentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageResidentPageRoutingModule {}
