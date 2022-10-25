import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentialReportPageRoutingModule } from './residential-report-routing.module';

import { ResidentialReportPage } from './residential-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentialReportPageRoutingModule
  ],
  declarations: [ResidentialReportPage]
})
export class ResidentialReportPageModule {}
