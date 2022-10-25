import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  
  public carehome;
  public package;
  public package_description;
  public package_headline;
  public expires;
  public expired = false;
  public isiOS = false;
  public offline = false;
  public versionNumber = "";
  public buildNumber = "";
  public isDashboardDataLoaded = false;

  constructor( 
    public modalController: ModalController,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router, 
    private iab: InAppBrowser,
    public appVersion: AppVersion,
    private platform: Platform
    ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userService.me((data)=> {
      console.log("me data=>", data);
      this.carehome = data.carehome.name;
      this.package = data.carehome.package.title;
      this.package_description = data.carehome.package.description;
      this.package_headline = data.carehome.package.headline;
      this.expires = new Date(data.carehome.package_end_date).toDateString();
      this.expired = data.expired;
    }, {})

    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then((value) => {
        this.versionNumber = "v" + value;
      });
      this.appVersion.getVersionCode().then((value: any)=> {
        this.buildNumber = "(" + value + ")";
      })
    } else {
      this.versionNumber = "Web";
      this.buildNumber = "";
    }
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login', {replaceUrl:true});
      this.dismiss();
    });
  }

  gotoLink(link) {
    this.iab.create(link, '_system', 'hidden=yes,location=no');
  }

  changePassword() {
    this.router.navigateByUrl('/change-password', {replaceUrl:true});
    this.dismiss();
  }

}
