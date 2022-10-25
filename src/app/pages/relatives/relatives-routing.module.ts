import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelativesPage } from './relatives.page';

const routes: Routes = [
  {
    path: '',
    component: RelativesPage
  },
  {
    path: ':id',
    loadChildren: () => import('./relative-detail/relative-detail.module').then( m => m.RelativeDetailPageModule)
  },
  {
    path: ':id/messages',
    loadChildren: () => import('../residents/messages/messages.module').then( m => m.MessagesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelativesPageRoutingModule {}
