import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PalPage } from './pal.page';

const routes: Routes = [
  {
    path: '',
    component: PalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PalPageRoutingModule {}
