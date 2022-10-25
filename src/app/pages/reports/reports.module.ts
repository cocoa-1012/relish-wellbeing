import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsPage } from './reports.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ReportsPageRoutingModule } from './reports-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { MbscModule } from '@mobiscroll/angular';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MbscModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ReportsPage }]),
    ReportsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
