import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelativeDetailPageRoutingModule } from './relative-detail-routing.module';

import { RelativeDetailPage } from './relative-detail.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { MbscModule } from '@mobiscroll/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelativeDetailPageRoutingModule,
    MbscModule,
    ComponentsModule
  ],
  declarations: [RelativeDetailPage]
})
export class RelativeDetailPageModule {}
