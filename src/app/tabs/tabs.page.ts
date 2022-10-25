import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Storage } from '@capacitor/storage';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  tabs: Array<{disabled: boolean}>;

  isFamilyOrganisation = true;
  isBasic = true;
  canReport = false;
  showTabs = false;
  isRelative = false;

  hasAlertedToExpiry = false;

  constructor(public userService: UserService, public alertController: AlertController) {
    console.log('tabs');
    this.tabs = [
      { disabled: false },
      { disabled: false },
      { disabled: false },
      { disabled: false },
      { disabled: false },
    ];
  }

  ngOnInit() {
    this.userService.me((data) => {
      Storage.set({ key: 'me', value: JSON.stringify(data) }).then(() => {

      });
      this.handleTabVisibility(data);
    },{})

  }

  handleTabVisibility(data) {
    var package_data = null;
    if(typeof data === 'string') {
      package_data = JSON.parse(data);
    } else {
      package_data = data;
    }

    var carehome_package = {
      'package_id': package_data['carehome'].package_id,
      'package_end_date': package_data['carehome'].package_end_date,
      'package_start_date': package_data['carehome'].package_start_date,
      'is_basic': package_data['carehome'].package.is_basic,
      'package_title': package_data['carehome'].package.title,
      'package_headline': package_data['carehome'].package.headline,
      'package_description': package_data['carehome'].package.description,
      'server_now': package_data['now'],
      'expired': package_data['expired'],
      'organisation_type': package_data['organisation_type'],
      'carehome_name': package_data['carehome'].name,
    }

    if(carehome_package.organisation_type == 2) {
      this.isFamilyOrganisation = true;
    } else {
      this.isFamilyOrganisation = false;
    }

    this.isBasic = carehome_package.is_basic;

    this.isRelative = package_data['type'] == 'family';

    if (carehome_package.package_title == "Package C") {
      this.canReport = true;
    } else {
      this.canReport = false;
    }

    if (this.isBasic) {
      //package is basic, disable all the functions apart from basic functionality
      this.setPackageBasic();
    } else {
      //now check if the package is expires. if it has, show a message and set to basic mode
      if (carehome_package.expired) {
        console.log("expired")
        //package expired, show message here
        if (data.is_basic) {
          return;//no need to show message if free expires
        }
        if (!this.hasAlertedToExpiry) {
          if(!localStorage.getItem('hasAlertedToExpiry')) {
            this.presentExpiredAlert();
            localStorage.setItem('hasAlertedToExpiry', "true");
          }

        }
        this.setPackageBasic();
        return;
      } else {

        if (data.package_title == "Package B") {
          this.tabs[3].disabled = true;
          this.tabs[4].disabled = true;
        }
      }
    }

    console.log('carehome_package', carehome_package);

  }

  setPackageBasic() {
    console.log('setting basic package');
    this.tabs[0].disabled = false;
    this.tabs[1].disabled = false;
    this.tabs[2].disabled = false;
    this.tabs[3].disabled = true;
    this.tabs[4].disabled = true;
  }


  async presentExpiredAlert() {
    const alert = await this.alertController.create({
      header: 'Package Expired',
      message: 'Your package has expired. This may be becuase you have cancelled your subscription or your payment card has expired.',
      buttons: ['OK']
    });

    await alert.present();

  }

}
