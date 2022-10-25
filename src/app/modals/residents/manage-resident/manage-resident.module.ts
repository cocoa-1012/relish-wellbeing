import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageResidentPageRoutingModule } from './manage-resident-routing.module';

import { ManageResidentPage } from './manage-resident.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageResidentPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ManageResidentPage],
})
export class ManageResidentPageModule {}
