import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SettingsComponent } from 'src/app/modals/settings/settings.component';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    DashboardPageRoutingModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: DashboardPage }]),
  ],
  declarations: [DashboardPage, SettingsComponent]
})
export class DashboardPageModule {}
