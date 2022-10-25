import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { PalPage } from 'src/app/modals/pal/pal.page';
import { ManageReportPage } from 'src/app/modals/reports/manage-report/manage-report.page';
import { SettingsComponent } from 'src/app/modals/settings/settings.component';
import { UpgradeComponent } from 'src/app/modals/upgrade/upgrade.component';
import { UserService } from 'src/app/services/user.service';
import { BarController, BarElement, Title, Chart, LinearScale, CategoryScale, PieController, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Storage } from '@capacitor/storage';
import { ResidentService } from 'src/app/services/resident.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild('doughnutCanvas', {static: false}) doughnutCanvas: ElementRef;

  doughnutChart: any

  slideOpts = {
    autoplay: {
      delay: 5000,
    },
  };

  slideOpts_activity = {
    autoplay: {
      delay: 5000,
    },
  };
  public featuredActivities = [];
  public totalUnreadMessages = 0;
  isBasic = true;
  canReport = false;
  canChat = false;
  isFamily: boolean;
  public carehome = "";
  group = "";
  public tutorials = [];
  public videos = [];
  public current_device_width = null;
  public isTablet = true;



  @ViewChild('dashboardActivityCountCanvas') private dashboardActivityCountCanvas: ElementRef;
  @ViewChild('dashboardActivityFeedbackCanvas') private dashboardActivityFeedbackCanvas: ElementRef;
  @ViewChild('dashboardPercentageOfResidentsEngagedCanvas') private dashboardPercentageOfResidentsEngagedCanvas: ElementRef;


  dashboardActivityCountChart: any;
  dashboardActivityFeedbackChart: any;
  dashboardPercentageOfResidentsEngagedChart: any;
  isCarehomeUser: boolean;
  isRelative: boolean;

  canViewFeaturedActivities: boolean;
  canViewDashboardGraphs: boolean;
  canViewPal: boolean;
  canViewVideos: boolean;
  canViewTutorials: boolean;

  constructor(
    public userService: UserService,
    public modalController: ModalController,
    private router: Router,
    public platform: Platform,
    public residentService: ResidentService,
  ) {
    this.current_device_width = this.platform.width();
    if (this.current_device_width > 480) {
      this.isTablet = true;
    } else {
      this.isTablet = false;
    }
    }

  ngOnInit() {

    Storage.get({ key: 'me'}).then(value => {
      let data = JSON.parse(value.value)
      this.handleTabVisibility(data);
    }).catch(reason => {
      console.error(reason);
    });

    UserService.ready.then(() => {
      this.canReport = UserService.canReport;
      this.canChat = UserService.canChat;
      this.isCarehomeUser = UserService.isCarehomeUser;
      this.isRelative = UserService.isRelative;

      this.canViewFeaturedActivities = UserService.canViewFeaturedActivities;
      this.canViewDashboardGraphs = UserService.canViewDashboardGraphs;
      this.canViewPal = UserService.canViewPal;
      this.canViewVideos = UserService.canViewVideos;
      this.canViewTutorials = UserService.canViewTutorials;

      setTimeout(() => {
        if (this.canViewDashboardGraphs) {
          this.initaliseCharts();
          this.getGraphData();
        }
      }, 1);

      this.getFeaturedData();
      this.getVideos();
      this.getTutorials();
      this.getUnreadCount();

    });


  }


  handleTabVisibility(data) {
    var package_data = null;
    if(typeof data === 'string') {
      package_data = JSON.parse(data);
    } else {
      package_data = data;
    }

    var carehome_package = {
      'is_basic': package_data['carehome'].package.is_basic,
      'organisation_type': package_data['organisation_type'],
      'carehome_name': package_data['carehome'].name,
    }
    this.isBasic = carehome_package.is_basic;
    this.isFamily = carehome_package.organisation_type == 2 ? true : false;
    this.carehome = carehome_package.carehome_name;
  }

  doRefresh(event) {
    if (this.canViewDashboardGraphs) {
      this.destroyCharts();
    }
    this.getFeaturedData();
    this.getVideos();
    this.getTutorials();
    this.getUnreadCount();

    setTimeout(() => {
      if (this.canViewDashboardGraphs) {
        this.initaliseCharts();
        this.getGraphData();
      }
      event.target.complete();
    }, 1);
  }

  ionViewDidEnter() {

  }

  ionViewDidLeave() {
    // if (this.canViewDashboardGraphs) {
      // this.destroyCharts();
    // }
  }

  destroyCharts() {
    this.dashboardActivityCountChart.destroy();
    this.dashboardActivityFeedbackChart.destroy();
    this.dashboardPercentageOfResidentsEngagedChart.destroy();
  }

  initaliseCharts(){
    Chart.register(BarController, Title, BarElement, LinearScale, CategoryScale, PieController, ArcElement, ChartDataLabels);

    this.dashboardActivityCountChart = new Chart(this.dashboardActivityCountCanvas.nativeElement, {
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
            text: 'Activity count'
          },
          datalabels: {
            display:false,
            formatter: function(value, context) {
              return Math.round(value) + ' activities';
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


    this.dashboardActivityFeedbackChart = new Chart(this.dashboardActivityFeedbackCanvas.nativeElement, {
      type: 'pie',
      options: {
        animation: {
          animateRotate:false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Activity Feedback'
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
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(90, 164, 105, 1)',
            'rgba(243, 215, 94, 1)',
            'rgba(200, 72, 69, 1)',
          ],
        }],
        labels: [
          'Positive',
          'Neutral',
          'Negative',
        ]
      }
    });

    this.dashboardPercentageOfResidentsEngagedChart = new Chart(this.dashboardPercentageOfResidentsEngagedCanvas.nativeElement, {
      type: 'pie',
      options: {
        animation: {
          animateRotate:false,
        },
        plugins: {
          title: {
            display: true,
            text: 'Percentage of residents engaged'
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
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(90, 164, 105, 1)',
            'rgba(200, 72, 69, 1)',
          ],
        }],
        labels: [
          'Engaged',
          'Inactive',
        ]
      }
    });

  }

  getGraphData(){

    this.userService.getActivityCountData((response) => {

      this.dashboardActivityCountChart.data.datasets = [];
      this.dashboardActivityCountChart.data.labels = response.labels;
      this.dashboardActivityCountChart.data.datasets.push({
        backgroundColor: 'rgba(71, 160, 90, 1)',
        data: response.data
      });

      this.dashboardActivityCountChart.update();

    }, {});

    this.userService.getActivityFeedbackData((response) => {

      this.dashboardActivityFeedbackChart.data.datasets.forEach((dataset) => {
        dataset.data = [
          response.overview.happy,
          response.overview.indifferent,
          response.overview.sad,
        ];
      });
      this.dashboardActivityFeedbackChart.update();

    }, {});

    this.userService.getPercentageOfResidentsEngagedData((response) => {

      this.dashboardPercentageOfResidentsEngagedChart.data.datasets.forEach((dataset) => {
        dataset.data = [
          response.active_percentage,
          response.inactive_percentage,
        ];
      });
      this.dashboardPercentageOfResidentsEngagedChart.update();

    }, {});

  }

  getUnreadCount() {
    if(!this.canChat) {
      return;
    }
    this.residentService.getMessagesUnreadCount((response) => {
      this.totalUnreadMessages = response.unread_count;
    }, {});
  }
  getTutorials() {
    this.userService.getTutorials((data) => {
      this.tutorials = data;
    },{});
  }

  getVideos() {
    console.log("getVideo started");
    this.userService.getVideos((data) => {
      this.videos = data;
    },{});
  }
  async newReport() {
    const modal = await this.modalController.create({
      component: ManageReportPage,
      backdropDismiss: false,
    });
    await modal.present();

    modal.onDidDismiss().then((response) => {

    });
  }
  emptyArray(n: number): any[] {
    return Array(n);
  }

  getFeaturedData() {
    if(!this.canViewFeaturedActivities) {
      return;
    }
    this.userService.getFeaturedActivities((data) => {
      this.featuredActivities = data.activities;
    },{});
  }

  gotoTutorial(tutorial) {
    if(!this.canViewTutorials) {
      return;
    }
    let title = tutorial.title;
    let isTutorials = "true";
    this.router.navigate(['/tabs/dashboard/' + tutorial.id, { title: title, isTutorials: isTutorials }]);
  }
  gotoVideo(video) {
    if(!this.canViewVideos) {
      return;
    }
    let isTutorials = "false";
    let title = video.title;
    this.router.navigate(['/tabs/dashboard/' + video.id, { title: title, isTutorials: isTutorials }]);
  }

  sendRelativeMessage() {
    this.router.navigate(['/tabs/relatives/']);
  }

  sendMessage() {
    if(!this.canChat) {
      return;
    }
    this.router.navigate(['/tabs/residents/',{segmentChangeValue: 2}]);
  }

  async presentSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
    });
    await modal.present();

    const { role } = await modal.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  async presentPal() {
    if(!this.canViewPal) {
      return;
    }
    const modal = await this.modalController.create({
      component: PalPage,
      backdropDismiss: false,
      componentProps: {
        'mode': 1,
      }
    });
    await modal.present();

    const { role } = await modal.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

  }

  async showUpgradeScreen(type = 1) {
    const upgradePage = await this.modalController.create({
      component: UpgradeComponent,
      backdropDismiss: false,
      componentProps: {
        type: type
      }
    });
    await upgradePage.present();
    const { role } = await upgradePage.onDidDismiss();
  }


}
