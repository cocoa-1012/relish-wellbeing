import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityFinderPage } from './activity-finder.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityFinderPage,
  },  {
    path: 'activity-detail',
    loadChildren: () => import('./activity-detail/activity-detail.module').then( m => m.ActivityDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityFinderPageRoutingModule {}
