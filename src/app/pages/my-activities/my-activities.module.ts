import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { MyActivitiesPage } from './my-activities.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { MyActivitiesPageRoutingModule } from './my-activities-routing.module';
import { EventAddComponent } from 'src/app/modals/event-add/event-add.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MbscModule, 
    ExploreContainerComponentModule,
    MyActivitiesPageRoutingModule
  ],
  declarations: [MyActivitiesPage, EventAddComponent]
})
export class MyActivitiesPageModule {}
