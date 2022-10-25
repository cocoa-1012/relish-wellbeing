import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityFinderPage } from './activity-finder.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ActivityFinderPageRoutingModule } from './activity-finder-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    ExploreContainerComponentModule,
    ActivityFinderPageRoutingModule
  ],
  declarations: [ActivityFinderPage]
})
export class ActivityFinderPageModule {}
