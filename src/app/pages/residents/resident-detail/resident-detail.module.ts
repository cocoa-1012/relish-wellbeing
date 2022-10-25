import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentDetailPageRoutingModule } from './resident-detail-routing.module';

import { ResidentDetailPage } from './resident-detail.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { MbscModule } from '@mobiscroll/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentDetailPageRoutingModule,
    MbscModule,
    ComponentsModule
  ],
  declarations: [ResidentDetailPage]
})
export class ResidentDetailPageModule {}
