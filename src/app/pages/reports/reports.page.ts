import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { IonSegment, IonSlides, IonContent, Platform, IonInfiniteScroll, ModalController, ActionSheetController, ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import { ManageReportPage } from 'src/app/modals/reports/manage-report/manage-report.page';
import { ReportService } from 'src/app/services/report.service';

import { ArcElement, BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PieController, PointElement, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EmailReportPage } from 'src/app/modals/email-report/email-report.page';

@Component({
  selector: 'app-reports',
  templateUrl: 'reports.page.html',
  styleUrls: ['reports.page.scss']
})
export class ReportsPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @ViewChild('dashboardAttendanceCanvas') private dashboardAttendanceCanvas: ElementRef;
  @ViewChild('dashboardActivityBonusBreakdownCanvas') private dashboardActivityBonusBreakdownCanvas: ElementRef;
  @ViewChild('dashboardActivityTimeDeliveredCanvas') private dashboardActivityTimeDeliveredCanvas: ElementRef;

  @HostListener('window:resize')
  onResize() {
    setTimeout(() => this.slides.update(), 500);
  }

  slideGraphOpts = {
    autoplay: {
      delay: 5000,
    },
  };

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight:true,
  };

  tabIndex = "0";

  public loading_reports = true;

  public request_data = {
    filterByDays: "7",
  }

  dashboardAttendanceChart: any;
  dashboardActivityBonusBreakdownChart: any
  dashboardActivityTimeDeliveredChart: any

  public current_platform = null;
  public current_device_width = null;
  public isTablet = true;
  public reports = [];
  public outstanding = [];

  public next_page_url = null;

  constructor(
    public platform: Platform,
    private router: Router,
    private modalController: ModalController,
    public reportService: ReportService,
    public actionSheetController: ActionSheetController,
    public toastCtrl: ToastController,
  ) {
    this.current_device_width = this.platform.width();
    if (this.current_device_width > 480) {
      this.isTablet = true;
    } else {
      this.isTablet = false;
    }
    if(this.platform.is('android')) {
      this.current_platform = 'android';
    } else {
      this.current_platform = 'ios';
    }
  }

  ngOnInit() {
    this.getReportsData();
    this.getOutstandingData();

    setTimeout(() => {
        this.initaliseCharts();
        this.getGraphData();
    }, 1);

  }


  ionViewDidEnter() {
  }

  destroyCharts() {
    this.dashboardAttendanceChart.destroy();
    this.dashboardActivityBonusBreakdownChart.destroy();
    this.dashboardActivityTimeDeliveredChart.destroy();
  }

  ionViewDidLeave() {
    // this.destroyCharts();
  }

  doRefresh(event) {
    this.destroyCharts();
    this.resetReportsData();
    setTimeout(() => {
        this.initaliseCharts();
        this.getReportsData();
        this.getOutstandingData();
        this.getGraphData();
        event.target.complete();
    }, 1);

  }

  initaliseCharts(){

    Chart.register(ArcElement, PieController, BarController, Legend, Title, ChartDataLabels, LinearScale, CategoryScale, BarElement, LineElement, LineController, PointElement);

    this.dashboardAttendanceChart = new Chart(this.dashboardAttendanceCanvas.nativeElement, {
      type: 'pie',
      options: {
        animation: {
          animateRotate:false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Average percentage of residents attending'
          },
          datalabels: {
            formatter: function(value, context) {
              return Math.round(value) + '%';
            }
          },
          legend: {
            display: true,
            position: 'top',
            onClick: (e) => e.native.stopPropagation(),
            labels: {
              padding:20,
            },
          }
        }
      },
      data: {
        datasets: [{
          data: [0, 100],
          backgroundColor: [
            'rgba(71, 160, 90, 1)',
            'rgba(190, 222, 197, 1)',
          ],
        }],
        labels: [
          'Attended',
          'Declined'
        ]
      }
    });

    this.dashboardActivityBonusBreakdownChart = new Chart(this.dashboardActivityBonusBreakdownCanvas.nativeElement, {
      type: 'bar',
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Activity bonus breakdown'
          },
          datalabels: {
            formatter: function(value, context) {
              return Math.round(value) + '%';
            }
          },
          legend: {
            display: false,
          }
        }
      },
      data: {
        labels: [],
        datasets: []
      }

    });

    this.dashboardActivityTimeDeliveredChart = new Chart(this.dashboardActivityTimeDeliveredCanvas.nativeElement, {
      type: 'line',
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Days ago'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Hours'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Activity time delivered'
          },
          datalabels: {
            display: false,
            formatter: function(value, context) {
              return Math.round(value) + ' minutes';
            }
          },
          legend: {
            display: false,
          }
        }
      },
      data: {
        labels: [],
        datasets: []
      }

    });


  }

  getGraphData(){

    this.reportService.getPercentageOfResidentsAttending((response) => {

      this.dashboardAttendanceChart.data.datasets.forEach((dataset) => {
        dataset.data = [
          response.avgAttendancePercentage,
          response.avgDeclinedPercentage,
        ];
      });
      this.dashboardAttendanceChart.update();

    }, this.request_data);

    this.reportService.getActivityBonusBreakdown((response) => {
      this.dashboardActivityBonusBreakdownChart.data.datasets = [];
      this.dashboardActivityBonusBreakdownChart.data.labels = response.labels;
      this.dashboardActivityBonusBreakdownChart.data.datasets.push({
        backgroundColor: 'rgba(71, 160, 90, 1)',
        data: response.data
      });

      this.dashboardActivityBonusBreakdownChart.update();

    }, this.request_data);

    this.reportService.getActivityTimeDelivered((response) => {
      this.dashboardActivityTimeDeliveredChart.data.datasets = [];
      this.dashboardActivityTimeDeliveredChart.data.labels = response.labels;
      this.dashboardActivityTimeDeliveredChart.data.datasets.push({
        backgroundColor: 'rgba(71, 160, 90, 1)',
        borderColor: 'rgba(71, 160, 90, 1)',
        data: response.data,
        showLine: true,
      });

      this.dashboardActivityTimeDeliveredChart.update();

    }, this.request_data);
  }

  getOutstandingData() {
    this.reportService.getOutstandingData((response) => {
      this.outstanding = response;
    }, this.request_data);
  }

  resetReportsData(scrollup=true) {
    this.reports = [];
    this.next_page_url = null;
    this.infiniteScroll.disabled = false;
    if(scrollup) {
      this.content.scrollToTop(400);
    }
  }

  getReportsData(event=null) {
    this.loading_reports = true;
    this.reportService.getReportsData((response) => {
      if(event) {
        event.target.complete();
        if(response.next_page_url == null) {
          event.target.disabled = true;
        }
      }
      this.next_page_url = response.next_page_url;
      if(this.next_page_url == null) {
        this.infiniteScroll.disabled = true;
      }
      this.reports.push(...response.data);
      // console.log(response.data);
      this.loading_reports = false;
      setTimeout(() => {
        this.slides.updateAutoHeight();
      }, 1);
    }, this.request_data, this.next_page_url);
  }

  slideDidChange(ev) {
    this.slides.getActiveIndex().then((value) => {
      this.tabIndex = value.toString();
      this.segment.value = this.tabIndex;
    });
  }

  setSlide(index) {
    this.tabIndex = index.toString();
    this.slides.slideTo(parseInt(index));
  }

  segmentChange(ev) {
    // console.log(ev);
    if(ev.detail.value != this.tabIndex) {
      this.tabIndex = ev.detail.value;
      this.slides.slideTo(parseInt(this.tabIndex));
    }
  }

  completedFilterSegmentChanged(ev) {
    this.request_data.filterByDays = ev.detail.value;
    this.resetReportsData();
    this.getReportsData();
  }

  dashboardFilterSegmentChanged(ev) {
    this.request_data.filterByDays = ev.detail.value;
    this.getGraphData();
  }
  outstandingFilterSegmentChanged(ev) {
    this.request_data.filterByDays = ev.detail.value;
    this.getOutstandingData();
  }

  resizeSlides() {
    this.slides.update();
    this.slides.updateAutoHeight();
  }

  logoClick() {

  }

  async presentAddReportModal() {
    const modal = await this.modalController.create({
      component: ManageReportPage,
      backdropDismiss: false,
    });
    await modal.present();

    modal.onDidDismiss().then((response) => {
      this.resetReportsData();
      this.getReportsData();
      this.getOutstandingData();
      this.getGraphData();
    });
  }

  async emailReports() {
    const emailReportModal = await this.modalController.create({
      component: EmailReportPage,
      componentProps: {
        type: "report"
      }
    });
    await emailReportModal.present();
    const { role } = await emailReportModal.onDidDismiss();
    if (role) {
      let toast = await this.toastCtrl.create({
        message: "Your report will be emailed to you in a moment",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  completedItem(report) {
    this.router.navigate(['/tabs/reports/' + report.id, { title: report.activityLabel }]);
  }

  reportBtn(item) {

  }

  async editReport(report) {
    const modal = await this.modalController.create({
      component: ManageReportPage,
      backdropDismiss: false,
      componentProps: {
        current_report: report,
      }
    });
    await modal.present();

    modal.onDidDismiss().then((response) => {
      this.resetReportsData();
      this.getReportsData();
      this.getOutstandingData();
      this.getGraphData();
    });
  }

  async deleteReport(report) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you want to delete the report for the activity \'' + report.activityLabel + '\'?',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        handler: () => {

          this.reportService.deleteReportById((response) => {
            this.getOutstandingData();
          }, report.id);

        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]

    });

    await actionSheet.present();

  }


}
