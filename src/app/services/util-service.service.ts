import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) { }

  async createAlert(header, backdropDismiss, message, buttonOptions1, buttonOptions2?): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      header,
      backdropDismiss,
      message,
      buttons: !buttonOptions2 ? [buttonOptions1] : [buttonOptions1, buttonOptions2]
    });
    return alert;
  }

  async createLoading(spinner, backdropDismiss, message): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
      spinner,
      backdropDismiss,
      message
    });
    return loading;
  }
}
