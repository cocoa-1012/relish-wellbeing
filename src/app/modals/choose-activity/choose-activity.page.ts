import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReportService } from 'src/app/services/report.service';
@Component({
  selector: 'app-choose-activity',
  templateUrl: './choose-activity.page.html',
  styleUrls: ['./choose-activity.page.scss'],
})
export class ChooseActivityPage implements OnInit {

  @Input() edit_report_id;
  @Input() current_report: any;

  /***/
  isReportActivityListReady: boolean = false;
  reportActivityList = [];

  selectedReportActivity: any;
  selectedReportActivityTitle: any;


  constructor(
    public modalController: ModalController,
    public reportService: ReportService,
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.searchReportActivity(null, true);//get initial list
  }

  searchReportActivity(term=null, initialLoad = false) {
    this.reportService.reportActivitySearch((data) => {
      this.isReportActivityListReady = true;
      this.reportActivityList = data;
      console.log("Activity List", data);
    }, {'term': term });
  }

  async dismiss() {
    await this.modalController.dismiss({
      'dismissed': true
    });
  }

  choose() {
    this.modalController.dismiss({selectedReportActivity: this.selectedReportActivity, selectedReportActivityTitle: this.selectedReportActivityTitle});
    console.log("Choosen", this.selectedReportActivity, this.selectedReportActivityTitle);
  }
}
