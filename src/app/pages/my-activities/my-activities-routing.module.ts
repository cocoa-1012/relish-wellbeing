import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyActivitiesPage } from './my-activities.page';

const routes: Routes = [
  {
    path: '',
    component: MyActivitiesPage,
  },
  {
    path: 'activity-detail',
    loadChildren: () => import('../activity-finder/activity-detail/activity-detail.module').then( m => m.ActivityDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyActivitiesPageRoutingModule {}
