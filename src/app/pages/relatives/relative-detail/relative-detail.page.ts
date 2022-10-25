import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonSegment, IonSlides, ModalController, NavController, ToastController } from '@ionic/angular';
import { MbscRangeOptions } from '@mobiscroll/angular';
import { ResidentService } from 'src/app/services/resident.service';

@Component({
  selector: 'app-relative-detail',
  templateUrl: './relative-detail.page.html',
  styleUrls: ['./relative-detail.page.scss'],
})
export class RelativeDetailPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild(IonContent) content: IonContent;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight:true,
    options: {
      autoHeight:true,
    }
  };

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
  public residential_reports = [];

  public range: Date[];
  rangeLabel = 'Engagement within the last 30 days';

  constructor(
    public residentService: ResidentService,
    private route: ActivatedRoute,
    public modalController: ModalController,
    private router: Router,
    public toastCtrl: ToastController,
  ) {

  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title');
      this.resident_id = params.get('id');
      this.getResidentData(this.resident_id);
    });
  }


  gotoMessages() {
    let title = this.title;
    this.router.navigate(['/tabs/relatives/' + this.resident_id + '/messages', { title: title, chat_room_id: this.resident.chat_room_id }], {replaceUrl: false});
  }

  set setRange(range: Date[]) {
    this.range = range;
    this.rangeLabel = 'Engagement between ' + this.convertDate(range[0]) + ' and ' + this.convertDate(range[1]);
    this.range = [new Date(range[0]), new Date(range[1])];
  }

  get setRange() {
    return this.range;
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-')
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
    if(ev.detail.value != this.tabIndex) {
      this.tabIndex = ev.detail.value;
      this.slides.slideTo(parseInt(this.tabIndex));
      this.slides.updateAutoHeight();
    }
  }

  goToResidentialReport(residential_report) {
    let title = this.title;
    this.router.navigate(['/tabs/reports/' + residential_report.report_id + '/residential-report/' + residential_report.id, { title: title, imgURL: this.resident.imageURL }], {replaceUrl: false});
  }


  getResidentData(id) {
    this.residentService.getResidentsDataById((response) => {
      this.resident = response;
      if(response.residential_reports_last_month_count) {
        this.residential_reports = response.residential_reports_last_month;
      } else {
        this.residential_reports = [];
      }

    }, id);
  }


  ionViewDidEnter() {
  }



}

