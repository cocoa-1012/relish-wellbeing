import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard.page';


const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
    path: ':id',
    loadChildren: () => import('./video-detail/video-detail.module').then( m => m.VideoDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
