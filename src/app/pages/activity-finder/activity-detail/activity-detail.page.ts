import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.page.html',
  styleUrls: ['./activity-detail.page.scss'],
})
export class ActivityDetailPage implements OnInit {

  activitysave: any;
  has_downloads = false;
  public activity: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public activityService: ActivityService,
    public alertCtrl: AlertController,
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.activity = state;
      this.has_downloads = this.activity.has_downloads;
      console.log("ActivityData", this.activity);
    }
  }

  ngOnInit() {

  }

  toggleSaveActivity(activity) {
    this.activityService.toggleSaveActivity((response) => {
      this.activitysave = this.activitysave ? false : true;
      this.activity.is_saved = !this.activity.is_saved;
    },{ activity_id: activity.id});
  }

  async emailResources(activity) {
    const alert = await this.alertCtrl.create({
      header: 'Sent',
      message: 'Check your email for your resources',
      buttons: ['OK']
    });

    this.activityService.emailResource((response) => {
      alert.present();
    },{ activity_id: activity.id});
  }
}
