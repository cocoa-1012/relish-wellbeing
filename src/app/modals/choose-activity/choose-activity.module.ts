import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MbscModule } from '@mobiscroll/angular';
import { ChooseActivityPageRoutingModule } from './choose-activity-routing.module';
import { ChooseActivityPage } from './choose-activity.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MbscModule,
    IonicModule,
    ChooseActivityPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ChooseActivityPage]
})
export class ChooseActivityPageModule {}
