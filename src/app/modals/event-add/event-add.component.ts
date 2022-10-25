import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { MbscRangeOptions } from '@mobiscroll/angular';
import { ChooseActivityPage } from 'src/app/modals/choose-activity/choose-activity.page';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.scss'],
})
export class EventAddComponent implements OnInit {


  @Input() current_event: any;

  loader: any;
  loadDelay: any;
  loaded = false;
  description = '';
  title = '';
  starts = null;
  ends = null;
  activity = '';
  reportActivity = '';
  reportActivityTitle = '';
  repeats = ''
  id = null;
  user_id = null;
  repeat_end = null;

  errors = {
    title: [],
    description: [],
    starts: [],
    ends: [],
  };

  public event = null;
  isEdit = false;
  now = new Date();
  someTimeFromNow = new Date(this.now.getTime() + 60 * 60000);


  dateSettings: MbscRangeOptions = {
    lang: 'en-UK',
    themeVariant: 'auto',
    controls: ['date', 'time'],
    dateWheels: '|D M d|',
    tabs: false,
    returnFormat: 'iso8601',
    maxRange: 18000000,
    timeFormat: 'h:ii a',
    defaultValue: [this.now, this.someTimeFromNow],
  };

  constructor(
    public modalCtrl: ModalController,
    public eventService: EventService,
    public load: LoadingController,
    private navParams: NavParams,
  ) {
  }

  ngOnInit() {
    console.log(this.current_event);
    if(this.current_event) {
      this.id = this.current_event.id;
      this.reportActivity = this.current_event.report_activity_id;
      this.reportActivityTitle = this.current_event.title;
      this.starts = this.current_event.start;
      this.ends = this.current_event.end;
      this.description = this.current_event.description;
      this.isEdit = true;
    }
  }

  dismiss(refresh=false) {
    this.modalCtrl.dismiss({
      'dismissed': refresh
    });
  }

  async chooseReportActivity() {
    const modal = await this.modalCtrl.create({
      component: ChooseActivityPage,
      backdropDismiss: false,
    });
    await modal.present();

    modal.onDidDismiss().then((response) => {
      this.reportActivityTitle = response.data.selectedReportActivityTitle;
      this.reportActivity = response.data.selectedReportActivity;
      console.log("Returned value", response);
    });
    console.log("Test ChooseActivity");
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

  post() {
    this.presentLoading();
    this.eventService.addEvent((data) => {
      this.dismissLoading();
      this.dismiss(true);
    }, {
      title: this.reportActivityTitle,
      description: this.description,
      starts: this.starts,
      ends: this.ends,
      report_activity_id: this.reportActivity,
      repeats: this.repeats,
      repeat_end: this.repeat_end,
    }, (data) =>  {
      console.log(data);
      this.dismissLoading();
      this.errors = data.error.errors;
    });



  }

  edit() {
    this.presentLoading();
    this.eventService.editEvent((data) => {
      this.dismissLoading();
      this.dismiss(true);
    }, {
      id: this.id,
      title: this.reportActivityTitle,
      description: this.description,
      starts: this.starts,
      ends: this.ends,
      report_activity_id: this.reportActivity,
      repeats: this.repeats,
      repeat_end: this.repeat_end,
    }, (data) =>  {
      console.log(data);
      this.dismissLoading();
      this.errors = data.error.errors;
    });
  }

}
