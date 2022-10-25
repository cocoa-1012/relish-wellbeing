import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelativesPageRoutingModule } from './relatives-routing.module';

import { RelativesPage } from './relatives.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelativesPageRoutingModule
  ],
  declarations: [RelativesPage]
})
export class RelativesPageModule {}
