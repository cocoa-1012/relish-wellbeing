import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { UpgradeComponent } from './upgrade/upgrade.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MbscModule
  ],
  declarations: [
    UpgradeComponent
  ],
  exports: [
    UpgradeComponent
  ]
})
export class ModalsModule {}
