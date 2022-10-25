import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { ActivitySkeletonComponent } from './activity-skeleton/activity-skeleton.component';
import { ActivityComponent } from './activity/activity.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { donutComponent } from './donut';
@NgModule({
  declarations: [ActivityComponent, ActivitySkeletonComponent, donutComponent],
  exports: [ActivityComponent, ActivitySkeletonComponent, donutComponent],
  imports: [
    FormsModule,
    MbscModule, CommonModule, IonicModule]
})

export class ComponentsModule{}
