import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { ResidentsPage } from './residents.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ResidentsPageRoutingModule } from './residents-routing.module';
import { ModalsModule } from 'src/app/modals/modals.module';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MbscModule,
    ExploreContainerComponentModule,
    ModalsModule,
    RouterModule.forChild([{ path: '', component: ResidentsPage }]),
    ResidentsPageRoutingModule,    
  ],
  declarations: [ResidentsPage],
})
export class ResidentsPageModule {}
