import { Component } from '@angular/core';
import { Network } from '@capacitor/network';
import { UtilServiceService } from 'src/app/services/util-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  networkAlert: any;
  networkLoading: any;
  notConnected: Boolean = false;

  constructor(
    private util: UtilServiceService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.checkInternetConnection();

  }

  async checkInternetConnection() {
    Network.addListener('networkStatusChange', async status => {
      if(status.connectionType == 'none'){
        if(!this.notConnected) {
          this.notConnected = true; 
          this.networkAlert = await this.util.createAlert('No Internet', false, 'You are not connected to the internet.',{
            text: 'Check',
            role: '',
            cssClass: 'secondary',
            handler: async () => {
              logCurrentNetworkStatus();
            }
          });      
          this.networkAlert.present();
        }
      } else {
        this.notConnected = false;
        if(this.networkAlert) {
          this.networkAlert.dismiss();
        }
        if(this.networkLoading) {
          this.networkLoading.dismiss();
        }
      }
    });

    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      this.networkLoading = await this.util.createLoading('circular', false, '');
      this.networkLoading.present();

      if(status.connectionType != 'none') {
        if(this.networkLoading) {
          this.networkLoading.dismiss();
        }
        if(this.networkAlert) {
          this.networkAlert.dismiss();
        }
      } 
    };
  }
}
