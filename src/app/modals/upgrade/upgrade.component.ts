import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
})
export class UpgradeComponent implements OnInit {

  type: any = "";
  loader: any;
  
  constructor(
    public modalController: ModalController,
    private navParams: NavParams,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.type = this.navParams.data.type;
    console.log("====>", this.type);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async upgrade_package(type) {

    this.loader = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 10000,
    });
    this.loader.present();
    setTimeout(() => {
      this.loader.dismiss();
    }, 10000);
    
  }

}
