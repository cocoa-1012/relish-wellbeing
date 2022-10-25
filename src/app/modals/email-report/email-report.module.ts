import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MbscModule } from '@mobiscroll/angular';
import { EmailReportPageRoutingModule } from './email-report-routing.module';
import { EmailReportPage } from './email-report.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MbscModule,
    IonicModule,
    EmailReportPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EmailReportPage]
})
export class EmailReportPageModule {}
