import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';

import { IonicModule } from '@ionic/angular';

import { ReportDetailPageRoutingModule } from './report-detail-routing.module';

import { ReportDetailPage } from './report-detail.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { ModalsModule } from 'src/app/modals/modals.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MbscModule, 
    IonicModule,
    ReportDetailPageRoutingModule,
    ComponentsModule,
    ModalsModule
  ],
  declarations: [ReportDetailPage]
})
export class ReportDetailPageModule {}
