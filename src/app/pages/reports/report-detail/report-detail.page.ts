import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonRouterOutlet, LoadingController, ModalController, NavController, ToastController } from "@ionic/angular";
import { ManageReportPage } from 'src/app/modals/reports/manage-report/manage-report.page';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.page.html',
  styleUrls: ['./report-detail.page.scss'],
})
export class ReportDetailPage implements OnInit {

  title: string;
  activityLabel: string = "";
  activityImage: string = "";
  item: {};
  public attendedResidents = [];
  public benefits = [];

  report_id: any;

  back_title: string;

  public report = {
    absent_count: null,
    activityLabel: null,
    attended_count: null,
    complete: 1,
    customActivity: null,
    group: null,
    id: null,
    overview: [],
    residential_reports: [],
    success: null,
    thoughts: null,
    updated_at: null,
    updated_at_formatted: null,
    coordinated_by_formatted: null,
    image: null,
    imageUrl: null,
    selectedAbsentResidents: [],
    selected_benefit_slugged: [],
    uuid: null,
    version: 2,
    when: null,
    report_activity: null,
    when_formatted: null
  };

  loader = null;
  enableReportEmailBTN = true;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public reportService: ReportService,
    private ionRouterOutlet: IonRouterOutlet,
    public load: LoadingController,
    public alertCtrl: AlertController,
    private navCtrl: NavController,
  ) {
  }

  getCustomText() {
    if(this.ionRouterOutlet.canGoBack()) {
      this.back_title = "Reports";
    } else {
      this.back_title = "Residents";
    }
  }

  setBackButtonAction() {
    if(this.ionRouterOutlet.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.back();
    }
  }

  ngOnInit() {
    this.getCustomText();
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title');
      this.report_id = params.get('id');

      this.getReportData(this.report_id);
    });

    this.item = this.route.snapshot.paramMap.get('item');
  }

  getReportData(report_id: any) {
    this.reportService.getReportsDataById((response) => {
      this.report = response;
      this.activityLabel = response.report_activity.report_activity_type.report_activity_type_category.name;
      this.activityImage = response.report_activity.report_activity_type.report_activity_type_category.thumbnail;
    }, report_id);
  }

  getChipColour(success) {
    switch (success) {
      case 'happy':
        return 'success';
      case 'indifferent':
        return 'warning';
      case 'sad':
        return 'danger';

      default:
        return null;
    }
  }

  async editReport(report) {

    const modal = await this.modalCtrl.create({
      component: ManageReportPage,
      backdropDismiss: false,
      componentProps: {
        current_report: report,
      }
    });
    await modal.present();

    modal.onDidDismiss().then((response) => {
      this.getReportData(this.report_id);
    });
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

  async presentToast(message) {
    let toast = await this.toastCtrl.create({
      message:message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async EmailReport() {
    this.presentLoading();
    this.reportService.emailReport((data) => {
      this.dismissLoading();
      this.presentConfirmAlert();
      // this.presentToast('Your report will be emailed to you in a moment');

      setTimeout(() => {
        this.enableReportEmailBTN = true;
      }, 5000);
    }, {'reportId': this.report.id});
  }

  async gotoResidentialReport(residential_report) {
    let title = residential_report.resident.preferred_name ? residential_report.resident.preferred_name : residential_report.resident.first_name + ' ' + residential_report.resident.last_name;
    this.router.navigate(['/tabs/reports/' + residential_report.report_id + '/residential-report/' + residential_report.id, { title: title, imgURL: residential_report.resident.imageURL }]);
  }

  async presentConfirmAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: "Report has been generated, please check your inbox shortly",
      buttons: ['OK']
    });

    await alert.present();
  }
}
