import { Component, NgZone, ViewChild } from '@angular/core';
import {
  ActionSheetController, AlertController, IonSegment,
  IonSlides, LoadingController, ModalController, ToastController
} from '@ionic/angular';
import { MbscCalendar, MbscEventcalendarOptions } from '@mobiscroll/angular';
import { EventAddComponent } from 'src/app/modals/event-add/event-add.component';
import { ActivityService } from 'src/app/services/activity.service';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import { UpgradeComponent } from 'src/app/modals/upgrade/upgrade.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-activities',
  templateUrl: 'my-activities.page.html',
  styleUrls: ['my-activities.page.scss']
})
export class MyActivitiesPage {

  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonSegment) segment: IonSegment;
  @ViewChild('mbscCal')

  activities: any = [];
  allactivities: any = [];
  loadedActivities: any;
  loader: any;
  loadDelay: any;
  loaded = false;
  offline: boolean = false;
  networkType = "none";
  mySavedActivities: any = [];
  myCompletedActivities = {};
  myFavouriteActivities: any = [];
  completedActivities: any = [];
  completedActivitiesArray: any = [];
  favouriteActivities: any = [];
  favouriteActivitiesArray: any = [];
  savedActivitiesArray = [];
  isBasic = true;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight:true,
  };

  year = null;
  month = null;

  tabIndex = "0";
  canViewEvents: boolean;
  canAddEvents: boolean;
  canViewAllActivities: boolean;

  isCalendarReady = false;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public activityService: ActivityService,
    public eventService: EventService,
    private _ngZone: NgZone,
    public load: LoadingController,
    public alertCtrl: AlertController,
    private router: Router,
  ) {}

  slideDidChange(ev) {
    this.slides.getActiveIndex().then((value) => {
      this.tabIndex = value.toString();
      this.segment.value = this.tabIndex;
    });
  }


  ngOnInit() {
    this.getSavedActivityData();

    UserService.ready.then(() => {
      this.canViewEvents = UserService.canViewEvents
      this.canAddEvents = UserService.canAddEvents;
      this.canViewAllActivities = UserService.canViewAllActivities;
      if(this.isCalendarReady) {
        this.getCurrentEvents();
      } else {
        setTimeout(() => {
          this.getCurrentEvents();
        }, 1000);
      }
    });

  }


  ionViewDidEnter() {

  }

  doRefresh(event) {
    this.getSavedActivityData();
    this.getCurrentEvents();
    event.target.complete();
  }

  gotoActivityDetail(activity) {
    if (this.isBasic && !activity.is_free) {
      console.log("Show Upgrade Screen");
      this.showUpgradeScreen(1);
      return;
    }
    this.router.navigate(['/tabs/my-activities/activity-detail'], {state: activity});
  }

  async showUpgradeScreen(type = 1) {
    const upgradePage = await this.modalCtrl.create({
      component: UpgradeComponent,
      backdropDismiss: false,
      componentProps: {
        type: type
      }
    });
    await upgradePage.present();
    const { role } = await upgradePage.onDidDismiss();
  }

  getCurrentEvents() {
    if(!this.canViewEvents) {
      return;
    }
    this.eventService.calendar((data) => {
      this.events = [];

      this._ngZone.run(() => {
        for (var i = 0; i < data.length; i++) {
          this.events.push({
            id: data[i].id,
            start: data[i].starts,
            end: data[i].ends,
            color: data[i].color,
            text: data[i].description ? data[i].title + '<div class="mbsc-bold md-event-desc">' + data[i].description + '</div>' : data[i].title,
            title: data[i].title,
            description: data[i].description,
            activity_id: data[i].activity_id,
            report_activity_id: data[i].report_activity_id,
            report_id: data[i].report_id,
          });
        }
      });
    }, this.year, this.month);
  }

  getSavedActivityData() {
    this.activityService.getSaveActivities((response) => {
      this.savedActivitiesArray = response;
    }, {});

  }

  setSlide(index) {
    this.tabIndex = index.toString();
    this.slides.slideTo(parseInt(index));
  }

  segmentChange(ev) {
    console.log(ev);
    if(ev.detail.value != this.tabIndex) {
      this.tabIndex = ev.detail.value;
      this.slides.slideTo(parseInt(this.tabIndex));
    }
  }

  resizeSlides() {
    this.slides.update();
    this.slides.updateAutoHeight();
  }

  calendar: MbscCalendar;
  view: string = 'month';

  get selectedView() {
    return this.view;
  }
  set selectedView(value: string) {
    this.view = value;
    this.changeView();
  }

  segmentChanged(ev) {
    this.selectedView = ev.detail.value;
  }

  events: Array<any> = [];

  eventSettings: MbscEventcalendarOptions = {
    lang: 'en-UK',
    display: 'inline',
    timeFormat: 'h:ii a',
    themeVariant: 'auto',
    onEventSelect: (event, inst) => {
      this.presentActionSheet(event.event);
    },
    onPageLoading: (event, inst) => {
      this.year = event.firstDay.getFullYear();
      this.month = event.firstDay.getMonth();
      this.isCalendarReady = true;
      setTimeout(() => {
        this.getCurrentEvents();
      }, 1);
    }
  };

  viewOptions: any = {
    calendar: { type: 'month' },
    eventList: { type: 'month', scrollable: true }
  };

  changeView() {
    setTimeout(() => {
      switch (this.view) {
        case 'month':
          this.viewOptions = {
            calendar: { type: 'month' },
            eventList: { type: 'month', scrollable: true }
          };
          break;
        case 'week':
          this.viewOptions = {
            calendar: { type: 'week' },
            eventList: { type: 'week', scrollable: true }
          };
          break;
        case 'day':
          this.viewOptions = {
            eventList: { type: 'day', scrollable: true }
          };
          break;
      }
    });
  }

  async presentActionSheet(event) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: event.title,
      buttons: [{
        text: 'Edit',
        handler: () => {
          this.editEvent(event);
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.deleteEvent(event.id);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  async presentToast(message) {

    let toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async deleteEvent(id) {
    const confirm = this.alertCtrl.create({
      header: 'Delete Event',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.eventService.deleteEvent((id) => {
              this.presentToast("Event deleted");
              this.getCurrentEvents();
            }, {
                id: id,
              }, (data) => {
                this.presentToast('Cannot delete event')
              });
          }
        }
      ]
    });
    (await confirm).present();

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

  async emailCalendar() {
    this.presentLoading();
    this.eventService.sendCalendar(() => {
        this.dismissLoading();
        this.presentToast('Calendar email sent');
    });
  }

  async editEvent(event) {
    if(!this.canAddEvents) {
      return;
    }
    const editModal = await this.modalCtrl.create({
      component: EventAddComponent,
      componentProps: {
        current_event: event,
      },
      backdropDismiss:false,
    });

    await editModal.present();

    editModal.onDidDismiss()
      .then((data) => {
        if(data.data.dismissed) {
          this.getCurrentEvents();
          this.presentToast('Your event has been edited.');
        }
      });
  }

  async addEvent() {
    if(!this.canAddEvents) {
      return;
    }
    const addModal = await this.modalCtrl.create({
      component: EventAddComponent,
      componentProps: {
        current_event:null
      }
    });
    await addModal.present();
    addModal.onDidDismiss()
      .then((data) => {
        if(data.data.dismissed) {
          this.getCurrentEvents();
          this.presentToast('Your event has been added.');
        }
      });
  }



}
