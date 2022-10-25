import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonInput, IonSegment, IonSlides, ModalController, Platform, ToastController } from '@ionic/angular';
import { ArcElement, Chart, DoughnutController } from 'chart.js';
import { EmailReportPage } from 'src/app/modals/email-report/email-report.page';
import { ManageResidentPage } from 'src/app/modals/residents/manage-resident/manage-resident.page';
import { ResidentService } from 'src/app/services/resident.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-residents',
  templateUrl: 'residents.page.html',
  styleUrls: ['residents.page.scss']
})
export class ResidentsPage {

  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild('dashboardSegment') dashboardSegment: IonSegment;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('searchbar') searchInputElement: IonInput;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @ViewChild('attendanceActiveCanvas') private attendanceActiveCanvas: ElementRef;
  @ViewChild('attendanceInactiveCanvas') private attendanceInactiveCanvas: ElementRef;

  @HostListener('window:resize')
  onResize() {
    setTimeout(() => this.slides.update(), 500);
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight:true,
  };

  tabIndex = "0";
  dashboardTabIndex = "0";
  isFamily = true;
  public loading_residents = true;

  public request_data = {
    search: null,
    sortBy: "a-z",
    sortDirection: 'asc',
  }

  public current_platform = null;

  public residents = [];
  public leastActive = [];
  public mostActive = [];
  public next_page_url = null;
  public search_term = null;


  public messages = [];

  public totalUnreadMessages = 0;

  public positiveFilteredMostData = [];
  public neutralFilteredMostData = [];
  public negativeFilteredMostData = [];
  public positiveFilteredLeastData = [];
  public neutralFilteredLeastData = [];
  public negativeFilteredLeastData = [];
  public filteredMostData = [];
  public filteredLeastData = [];
  public isFiltered = true;
  public faceUrl = "";

  dashboardAttendanceActiveChart: any;
  dashboardAttendanceInactiveChart: any;
  happyPercentageOffset = 251.3274122872;
  indifferentPercentageOffset = 251.3274122872;
  sadPercentageOffset = 251.3274122872;
  isResidentsEngagement = true;

  activePercentage = 0;
  activeCount = '-';
  inactivePercentage = 0;
  inactiveCount = '-';
  public segmentChangeValue: any = {detail: {value: 0}};
  loading_messages: boolean;
  canChat: boolean;

  constructor(
    public residentService: ResidentService,
    public platform: Platform,
    public modalController: ModalController,
    private router: Router,
    public toastCtrl: ToastController,
    public userService: UserService,
    private route: ActivatedRoute,
    ) {
    if(this.platform.is('android')) {
      this.current_platform = 'android';
    } else {
      this.current_platform = 'ios';
    }
  }

  ngOnInit() {
    UserService.ready.then(() => {
      this.isFamily = UserService.isFamily;
      this.canChat = UserService.canChat;

      this.getSummaryData();
      this.getResidentsData();
      setTimeout(() => {
        this.initialiseGraphs();
      }, 1);
    });
  }

  ionViewDidEnter() {

    this.segmentChange(this.segmentChangeValue);
    if(this.canChat) {
      this.getMessagesData();
      this.getUnreadCount();
    }

  }

  ionViewDidLeave() {
    // this.destroyCharts();
  }


  setPercentage(percent, face) {
    let circumference = 40 * 2 * Math.PI;

    const offset = circumference - percent / 100 * circumference;
    if (face == "happy") {
      this.happyPercentageOffset = offset;
    }
    if (face == "indifferent") {
      this.indifferentPercentageOffset = offset;
    }
    if (face == "sad") {
      this.sadPercentageOffset = offset;
    }
  }

  destroyCharts() {
    this.dashboardAttendanceActiveChart.destroy();
    this.dashboardAttendanceInactiveChart.destroy();
  }

  initialiseGraphs() {

    Chart.register(ArcElement, DoughnutController);

    this.dashboardAttendanceActiveChart = new Chart(this.attendanceActiveCanvas.nativeElement, {
      type: 'doughnut',
      options: {
        animation: {
          animateRotate:false,
        },
        plugins: {
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
        }]
      }
    });

    this.dashboardAttendanceInactiveChart = new Chart(this.attendanceInactiveCanvas.nativeElement, {
      type: 'doughnut',
      options: {
        animation: {
          animateRotate:false,
        },
        plugins: {
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
            'rgba(208, 46, 57, 1)',
            'rgba(244, 181, 188, 1)',
          ],
        }]
      }
    });
  }

  dashboardSegmentChanged(ev) {
    if(ev.detail.value != this.dashboardTabIndex) {
      this.dashboardTabIndex = ev.detail.value;
    }
    setTimeout(() => {
      this.slides.updateAutoHeight();
    }, 10);
  }


  slideDidChange(ev) {
    this.slides.getActiveIndex().then((value) => {
      this.tabIndex = value.toString();
      this.segment.value = this.tabIndex;

      if(this.tabIndex == "1" && this.residents.length == 0) {
        this.getResidentsData();
      }
    });
  }

  setSlide(index) {
    this.tabIndex = index.toString();
    this.slides.slideTo(parseInt(index));
  }

  segmentChange(ev) {
    this.segmentChangeValue.detail.value = ev.detail.value;
    if(ev.detail.value != this.tabIndex) {
      this.tabIndex = ev.detail.value;
      this.slides.slideTo(parseInt(this.tabIndex));
    }
  }

  sortSegmentChanged(ev) {
    this.request_data.sortBy = ev.detail.value;

    if(this.request_data.sortBy == 'a-z') {
      this.request_data.sortDirection = 'asc';
    } else {
      this.request_data.sortDirection = 'desc';
    }

    this.resetResidentsData();
    this.getResidentsData();
  }

  resetResidentsData(scrollup=true) {
    this.residents = [];
    this.messages = [];
    this.next_page_url = null;
    this.infiniteScroll.disabled = false;
    if(scrollup) {
      this.content.scrollToTop(400);
    }
  }

  getUnreadCount() {
    this.residentService.getMessagesUnreadCount((response) => {
      this.totalUnreadMessages = response.unread_count;
    }, {});
  }

  getResidentsData(event=null) {
    this.loading_residents = true;
    this.residentService.getResidentsData((response) => {
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
      this.residents.push(...response.data);
      // console.log(response.data);
      this.loading_residents = false;
      setTimeout(() => {
        this.slides.updateAutoHeight();
      }, 1);
    }, this.request_data, this.next_page_url);
  }

  getSummaryData() {
    this.residentService.getSummaryData((data) => {
      // console.log(data);
      this.leastActive = data.leastActive;
      this.mostActive = data.mostActive;

      this.setPercentage(data.overview.happy, 'happy');
      this.setPercentage(data.overview.indifferent, 'indifferent');
      this.setPercentage(data.overview.sad, 'sad');


      if (data.overview.happy == 0 && data.overview.indifferent == 0 && data.overview.sad == 0) {
        this.isResidentsEngagement = false;
      } else {
        this.isResidentsEngagement = true;
      }

      this.activePercentage = data.active_percentage;
      this.activeCount = data.active_count;
      this.inactivePercentage = data.inactive_percentage
      this.inactiveCount = data.inactive_count;


      this.dashboardAttendanceActiveChart.data.datasets.forEach((dataset) => {
        dataset.data = [
          this.activePercentage,
          100 - this.activePercentage,
        ];
      });
      this.dashboardAttendanceActiveChart.update();

      this.dashboardAttendanceInactiveChart.data.datasets.forEach((dataset) => {
        dataset.data = [
          this.inactivePercentage,
          100 - this.inactivePercentage,
        ];
      });
      this.dashboardAttendanceInactiveChart.update();
      this.positiveFilteredMostData = this.mostActive.filter((resident) => {
        return resident.success == "happy";
      });
      this.neutralFilteredMostData = this.mostActive.filter((resident) => {
        return resident.success == "indifferent";
      });
      this.negativeFilteredMostData = this.mostActive.filter((resident) => {
        return resident.success == "sad";
      });
      this.positiveFilteredLeastData = this.leastActive.filter((resident) => {
        return resident.success == "happy";
      });
      this.neutralFilteredLeastData = this.leastActive.filter((resident) => {
        return resident.success == "indifferent";
      });
      this.negativeFilteredLeastData = this.leastActive.filter((resident) => {
        return resident.success == "sad";
      });
    },{});
  }

  resizeSlides() {
    this.slides.update();
    this.slides.updateAutoHeight();
  }

  presentSearch() {
    this.content.scrollToTop(400);
    setTimeout(() => {
      this.searchInputElement.setFocus();
    }, 410);
  }

  searchFocused() {
    // console.log('Search focused');
    this.setSlide(1);
  }

  searchCleared() {
    // console.log('Search cleared');
  }

  searchChanged(event) {
    // console.log(event);
    // console.log(this.search_term);
    this.request_data.search = this.search_term;


    this.resetResidentsData();
    this.getResidentsData();
  }

  changeOrder() {
    if(this.loading_residents) {
      return;
    }
    if(this.request_data.sortDirection == 'desc') {
      this.request_data.sortDirection = 'asc';
    } else {
      this.request_data.sortDirection = 'desc';
    }
    this.resetResidentsData();
    this.getResidentsData();
  }

  async presentAddResidentModal() {
    const modal = await this.modalController.create({
      component: ManageResidentPage,
      backdropDismiss: false,
    });
    await modal.present();

    modal.onDidDismiss().then((response) => {
      // console.log(response);
      if(response.data && response.data.hasOwnProperty('reloadData') && response.data.reloadData) {
        this.resetResidentsData();
        this.getResidentsData();
      }
    });
  }

  filterDataBy(item) {
    this.isFiltered = true;
    if (item == "happy") {
      this.faceUrl = "/assets/faces/smile-regular.svg";
      this.filteredMostData = this.positiveFilteredMostData;
      this.filteredLeastData = this.positiveFilteredLeastData;
    } else if (item == "indifferent") {
      this.faceUrl = "/assets/faces/meh-regular.svg";
      this.filteredMostData = this.neutralFilteredMostData;
      this.filteredLeastData = this.neutralFilteredLeastData;
    } else {
      this.faceUrl = "/assets/faces/frown-regular.svg";
      this.filteredMostData = this.negativeFilteredMostData;
      this.filteredLeastData = this.negativeFilteredLeastData;
    }
  }

  filterClose() {
    this.isFiltered = false;
  }
  gotoDetail(resident) {
    let title = resident.preferred_name ? resident.preferred_name : resident.first_name + ' ' + resident.last_name;
    this.router.navigate(['/tabs/residents/' + resident.id, { title: title }]);
  }

  gotoMessages(resident) {
    resident.unread_messages_count = 0;
    let title = resident.preferred_name ? resident.preferred_name : resident.first_name + ' ' + resident.last_name;
    this.router.navigate(['/tabs/residents/' + resident.id + '/messages', { title: title, chat_room_id: resident.chat_room_id }], {replaceUrl: false});
  }

  async emailReport() {
    const emailReportModal = await this.modalController.create({
      component: EmailReportPage,
      componentProps: {
        type: "resident"
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

  getMessagesData() {
    if (!this.isFamily) {
      this.loading_messages = true;
      this.residentService.getMessagesList((response) => {
        this.messages = response;
        this.loading_messages = false;
        this.slides.updateAutoHeight();
      }, this.request_data)
    }
  }

}
