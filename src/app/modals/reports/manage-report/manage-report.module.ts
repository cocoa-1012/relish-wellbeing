import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { IonicModule } from '@ionic/angular';

import { ManageReportPageRoutingModule } from './manage-report-routing.module';

import { ManageReportPage } from './manage-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MbscModule,
    IonicModule,
    ManageReportPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ManageReportPage]
})
export class ManageReportPageModule {}
