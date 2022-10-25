import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController, AlertController, NavParams } from '@ionic/angular';
import { ReportService } from 'src/app/services/report.service';
import { ResidentService } from 'src/app/services/resident.service';
import { MbscRangeOptions } from '@mobiscroll/angular';


const now = new Date();
const curr = new Date();
const yesterday = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() - 1);
const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
const startMonth = new Date(curr.getFullYear(), curr.getMonth() - 1, 1);
const endMonth = new Date(curr.getFullYear(), curr.getMonth(), 0);
const thisMonthStart = new Date(curr.getFullYear(), curr.getMonth(), 1);
const thisMonthEnd = new Date(curr.getFullYear(), curr.getMonth()+1, 0);


@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.page.html',
  styleUrls: ['./email-report.page.scss'],
})
export class EmailReportPage implements OnInit {

  type = 'report';
  residentId = null;
  theme = '';
  exclude_inactive = true;
  isToday = false;
  isYesterday = false;
  isThisWeek = false;
  isLastMonth = false;
  isThisMonth = false;
  isCustom = false;

  from = null;
  to = null;
  range: Array<Date>;
  errors = {};

  dateSettings: MbscRangeOptions = {
    lang: 'en-UK',
    returnFormat: 'iso8601',
    dateWheels: '|D M d|',
    tabs: false,
    themeVariant: 'auto'
  };
  offline: boolean = false;
  loader: any;

  constructor(
    public modalController: ModalController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    public load: LoadingController,
    public alertCtrl: AlertController,
    public reportService: ReportService,
    public residentService: ResidentService,
  ) { }

  ngOnInit() {
    this.theme = this.navParams.data.theme;
    this.type = this.navParams.data.type;
    this.residentId = this.navParams.data.residentId;
    console.log("Theme: ", this.theme, "Type: ", this.type, "ResidentID: ", this.residentId);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async showMessageToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }


  async presentAlert(message) {

    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();

  }

  async presentLoading() {
    this.loader = await this.load.create({
      message: 'Please wait...',
      duration: 10000
    });
    await this.loader.present();
  }

  dismissLoading() {
    this.loader.dismiss();
  }

  async presentConfirmAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: "Report has been generated, please check your inbox shortly",
      buttons: ['OK']
    });

    await alert.present();
  }

  async generate() {

    this.presentLoading();

    if(this.type == "report") {

      this.reportService.emailReports((data) => {
        if (data.success) {
          this.dismissLoading();
          this.presentConfirmAlert();
          this.dismiss();
        } else {
          this.dismissLoading();
          this.presentAlert(data.message);
        }
      }, {
        range: this.range
      });

    } else {
      if (this.residentId == null) {
        //multiple residents
        this.residentService.emailResidentialReports((data) => {
          if (data.success) {
            this.dismissLoading();
            this.presentConfirmAlert();
            this.dismiss();
          } else {
            this.dismissLoading();
            this.presentAlert(data.message);
          }
        }, {
          range: this.range,
          exclude_inactive: this.exclude_inactive,
        });

      } else {
        //single resident
        this.residentService.emailResidentialReport((data) => {
          if (data.success) {
            this.dismissLoading();
            this.presentConfirmAlert();
            this.dismiss()
          } else {
            this.dismissLoading();
            this.presentAlert(data.message);
          }
        }, {
          range: this.range,
          'residentId': this.residentId,
          exclude_inactive: false,
        });

      }

    }



  }

  clearIsDate() {
    this.isToday = false;
    this.isYesterday = false;
    this.isThisWeek = false;
    this.isLastMonth = false;
    this.isThisMonth = false;
    this.isCustom = false;
  }

  today() {
    this.range = [now, now];
    this.showMessageToast("Today Selected");
    this.clearIsDate();
    this.isToday = true;
  }

  yesterday() {
    this.range = [yesterday, yesterday];
    this.showMessageToast("Yesterday Selected");
    this.clearIsDate();
    this.isYesterday = true;
  }

  thisWeek() {
    this.range = [firstday, lastday];
    this.showMessageToast("This Week Selected");
    this.clearIsDate();
    this.isThisWeek = true;

  }

  lastMonth() {
    this.range = [startMonth, endMonth];
    this.showMessageToast("Last Month Selected");
    this.clearIsDate();
    this.isLastMonth = true;

  }

  thisMonth() {
    this.range = [thisMonthStart, thisMonthEnd];
    this.showMessageToast("This Month Selected");
    this.clearIsDate();
    this.isThisMonth = true;
  }

  custom() {
    this.clearIsDate();
    this.isCustom = true;
  }
}
