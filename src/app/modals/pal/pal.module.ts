import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PalPageRoutingModule } from './pal-routing.module';

import { PalPage } from './pal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PalPageRoutingModule
  ],
  declarations: [PalPage]
})
export class PalPageModule {}
