import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonSegment, IonSlides, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { MbscRangeOptions } from '@mobiscroll/angular';
import { EmailReportPage } from 'src/app/modals/email-report/email-report.page';
import { PalPage } from 'src/app/modals/pal/pal.page';
import { ManageResidentPage } from 'src/app/modals/residents/manage-resident/manage-resident.page';
import { PalService } from 'src/app/services/pal.service';
import { ResidentService } from 'src/app/services/resident.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.page.html',
  styleUrls: ['./resident-detail.page.scss'],
})
export class ResidentDetailPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('chatWrapper') chatWrapper;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @HostListener('window:resize')
  onResize() {
    setTimeout(() => this.slides.update(), 500);
  }
  
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight:true,
    options: {
      autoHeight:true,
    }
  };

  public current_platform = null;
  now =  new Date();
  presets = {
    last7Days: new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 7),
    last30Days: new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 30),
    last60Days: new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 60),
    last90Days: new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - 90),
  }

  rangeSettings: MbscRangeOptions = {
    themeVariant: 'auto',
    lang: 'en-UK',
    dateWheels: '|D M d|',
    returnFormat: 'iso8601',
    display: 'center',
    yearChange:false,
    max: new Date(),
    maxRange: 3.154e+10,
    responsive: {
      medium: {
        months: 2
      }
    }
  }

  tabIndex = "0";

  title: string = 'Resident';
  type = 'engagement';
  public resident_id;
  public resident = {
    last_updated_at_formatted: null,
    activity_level: null,
    room_number: null,
    chat_room_id: null,
    dob_formatted: null,
    direct_feedback_count: null,
    activities_attended_last_month_percentage: null,
    activities_attended_last_month_count: null,
    residential_reports_last_month_count: null,
    first_name: null,
    preferred_name: null,
    age: null,
    last_name: null,
    imageURL: null,
  };

  happyPercentageOffset = 251.3274122872;
  indifferentPercentageOffset = 251.3274122872;
  sadPercentageOffset = 251.3274122872;
  isResidentEngagement = true;
  lastUpdated = null;
  public residential_reports = [];

  public range: Date[];
  rangeLabel = 'Engagement within the last 30 days';
  canChat: any;

  constructor(
    public residentService: ResidentService,
    private route: ActivatedRoute,
    public platform: Platform,
    public modalController: ModalController,
    private router: Router,
    private navController: NavController,
    private palService: PalService,
    public toastCtrl: ToastController
  ) {
    if(this.platform.is('android')) {
      this.current_platform = 'android';
    } else {
      this.current_platform = 'ios';
    }
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title');
      this.resident_id = params.get('id');
      this.getResidentData(this.resident_id);
    });
  }

  set setRange(range: Date[]) {
    this.range = range;
    this.rangeLabel = 'Engagement between ' + this.convertDate(range[0]) + ' and ' + this.convertDate(range[1]);
    this.range = [new Date(range[0]), new Date(range[1])];
    this.onRangeChange();
  }

  get setRange() {
    return this.range;
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-')
  }

  setLast7Days() {
    this.range = [this.presets.last7Days, this.now];
    this.rangeLabel = 'Engagement within the last 7 days';
    this.onRangeChange();
  }
  setLast30Days() {
    this.range = [this.presets.last30Days, this.now];
    this.rangeLabel = 'Engagement within the last 30 days';
    this.onRangeChange();
  }
  setLast60Days() {
    this.range = [this.presets.last60Days, this.now];
    this.rangeLabel = 'Engagement within the last 60 days';
    this.onRangeChange();
  }
  setLast90Days() {
    this.range = [this.presets.last90Days, this.now];
    this.rangeLabel = 'Engagement within the last 90 days';
    this.onRangeChange();
  }

  onRangeChange = this.debounce(() => {
    this.getResidentialReportsInRange();
  }, 250, false);

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
    if(ev.detail.value != this.tabIndex) {
      this.tabIndex = ev.detail.value;
      this.slides.slideTo(parseInt(this.tabIndex));
      this.slides.updateAutoHeight();
    }
  }

  goToResidentialReport(residential_report) {
    let title = this.title;
    this.router.navigate(['/tabs/residents/' + residential_report.report_id + '/residential-report/' + residential_report.id, { title: title, imgURL: this.resident.imageURL }], {replaceUrl: false});
  }


  gotoMessages() {
    let title = this.title;
    this.router.navigate(['/tabs/residents/' + this.resident_id + '/messages', { title: title, chat_room_id: this.resident.chat_room_id }], {replaceUrl: false});
  }


  getResidentData(id) {
    this.residentService.getResidentsDataById((response) => {
      this.resident = response;
      this.setPercentage(response.overview.happy, 'happy');
      this.setPercentage(response.overview.indifferent, 'indifferent');
      this.setPercentage(response.overview.sad, 'sad');

      if(response.residential_reports_last_month_count) {
        this.residential_reports = response.residential_reports_last_month;
      } else {
        this.residential_reports = [];
      }

    }, id);
  }

  getResidentialReportsInRange() {
    this.residentService.getResidentialDataByRange((response) => {
      this.setPercentage(response.overview.happy, 'happy');
      this.setPercentage(response.overview.indifferent, 'indifferent');
      this.setPercentage(response.overview.sad, 'sad');
      this.residential_reports = response.reports;
    }, this.resident_id, this.range);
  }

  ionViewDidEnter() {
    this.canChat = UserService.canChat;
  }


  async presentPal() {
    const modal = await this.modalController.create({
      component: PalPage,
      backdropDismiss: false,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log('onDidDismiss resolved with data', data);
    if(data != -1) {
      this.changeResidentPAL(data);
    }
  }

  changeResidentPAL(activity_level) {
    this.palService.changeResidentsPAL((data) => {
      this.getResidentData(this.resident_id);
    }, {
      'selectedResidents' : [this.resident_id],
      'activity_level': activity_level,
    }, (data) => {
      alert("Something went wrong updating the pal for this resident")
    });
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

  async editResident(resident) {

    const modal = await this.modalController.create({
      component: ManageResidentPage,
      backdropDismiss: false,
      componentProps: resident
    });
    await modal.present();

    modal.onDidDismiss().then((response) => {
      // console.log(response);

      if(response.data && response.data.hasOwnProperty('archived') && response.data.archived) {
        this.navController.navigateBack('/tabs/residents', { state: { shouldReload:true }} );
      } else {
        this.getResidentData(this.resident_id);
      }

    });
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  async EmailReport() {
    const emailReportModal = await this.modalController.create({
      component: EmailReportPage,
      componentProps: {
        type: "resident",
        residentId: this.resident_id
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


}

