import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { PalPage } from 'src/app/modals/pal/pal.page';
import { UpgradeComponent } from 'src/app/modals/upgrade/upgrade.component';
import { ActivityService } from 'src/app/services/activity.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-activity-finder',
  templateUrl: 'activity-finder.page.html',
  styleUrls: ['activity-finder.page.scss']
})
export class ActivityFinderPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;


  public activities = [];
  public next_page_url = null;
  public showStage = true;
  public loading = true;
  public totalNumberOfResults = 0;
  public filters = {
    stage: [
      {
        'level' : '4',
        'color' : '#00A3E0',
        'slug' : 'Planned',
        'label':'Planned',
        'active' : false,
        'image' : '/assets/levels/planned.svg',
      },
      {
        'level' : '3',
        'color' : '#EA7601',
        'slug' : 'Exploratory',
        'label':'Exploratory',
        'active' : false,
        'image' : '/assets/levels/exploratory.svg',
      },
      {
        'level' : '2',
        'color' : '#EDBF26',
        'slug' : 'Sensory Level',
        'label':'Sensory',
        'active' : false,
        'image' : '/assets/levels/sensory.svg',
      },
      {
        'level' : '1',
        'color' : '#64A908',
        'slug' : 'Reflex',
        'label':'Reflex',
        'active' : false,
        'image' : '/assets/levels/reflex.svg',
      },
    ]
  }

  public active_tags = [];

  public active_tags_stage = [];
  public active_tags_time = [];
  public active_tags_type = [];
  public active_tags_interest = [];

  public used_intrest_tags = [];

  public buttons = [];

  isBasic = true;
  isFamily = true;
  canViewAllActivities:boolean;
  canViewPal: boolean;

  constructor(
    public activityService: ActivityService,
    private router: Router,
    public modalController: ModalController
    ) {}

  ngOnInit() {
    this.buttons = [
      {
        image: '/assets/activity_categories_jpg/Art%20and%20craft.jpg',
        title: 'Art & Crafts',
        color: '#E51F20'
      },{
        image: '/assets/activity_categories_jpg/pumpering.jpg',//
        title: 'Unsettled',
        color: '#C58CB7'
      },{
        image: '/assets/activity_categories_jpg/reminisence.jpg',
        title: 'Reminiscence',
        color: '#988479'
      },{
        image: '/assets/activity_categories_jpg/trips%20out.jpg',
        title: 'Trips Out',
        color: '#63A90A'
      },{
        image: '/assets/activity_categories_jpg/conversation.jpg',//
        title: 'Discussion',
        color: '#01548A'
      },{
        image: '/assets/activity_categories_jpg/event.jpg',
        title: 'Event',
        color: '#D19A02'
      },{
        image: '/assets/activity_categories_jpg/family%20visit.jpg',//
        title: 'Body',
        color: '#57C3F1'
      },{
        image: '/assets/activity_categories_jpg/nature.jpg',//
        title: 'In the Garden',
        color: '#1C7300'
      },{
        image: '/assets/activity_categories_jpg/read%20and%20write.jpg',
        title: 'Read & Write',
        color: '#01B2A8'
      },{
        image: '/assets/activity_categories_jpg/games.jpg',
        title: 'Games',
        color: '#EA7600'
      },{
        image: '/assets/activity_categories_jpg/daily_tasks.jpg',
        title: 'Daily Tasks',
        color: '#ADADAD'
      },{
        image: '/assets/activity_categories_jpg/puzzles%20and%20quizes.jpg',
        title: 'Puzzles & Quizzes',
        color: '#F6B14A'
      },{
        image: '/assets/activity_categories_jpg/food_drink.jpg',
        title: 'Food',
        color: '#BB7657'
      },{
        image: '/assets/activity_categories_jpg/sensory.jpg',
        title: 'Sensory',
        color: '#863E7E'
      },{
        image: '/assets/activity_categories_jpg/music.jpg',
        title: 'Music',
        color: '#FD8382'
      },{
        image: '/assets/activity_categories_jpg/movement.jpg',//
        title: 'For Men',
        color: '#DB1D5B'
      },{
        image: '/assets/activity_categories_jpg/spiritual.jpg',//
        title: 'Visually Impaired',
        color: '#67326A'
      },{
        image: '/assets/activity_categories_jpg/media.jpg',
        title: 'Media',
        color: '#007467'
      },
    ];

    this.getUsedInterestTags();
    this.getData();
    this.getResultCount();

    UserService.ready.then(() => {
      this.isBasic = UserService.isBasic;
      this.isFamily = UserService.isFamily;
      this.canViewAllActivities = UserService.canViewAllActivities;
      this.canViewPal = UserService.canViewPal;
    });

  }

  emptyArray(n: number): any[] {
    return Array(n);
  }

  isActive(slug) {
    return this.active_tags.indexOf(slug) !== -1;
  }

  toggleFilter(slug, type) {
    this.next_page_url = null;
    this.loading = true;

    var index = this.active_tags.indexOf(slug);
    if(index !== -1) {
      this.active_tags.splice(index, 1);
    } else {
      this.active_tags.push(slug);
    }

    if(type == 'stage') {
      var index = this.active_tags_stage.indexOf(slug);
      if(index !== -1) {
        this.active_tags_stage.splice(index, 1);
      } else {
        this.active_tags_stage.push(slug);
      }
    }

    if(type == 'time') {
      if(index !== -1) {
        this.active_tags_time.splice(index, 1);
      } else {
        this.active_tags_time.push(slug);
      }
    }

    if(type == 'type') {
      var index = this.active_tags_type.indexOf(slug);
      if(index !== -1) {
        this.active_tags_type.splice(index, 1);
      } else {
        this.active_tags_type.push(slug);
      }
    }

    if(type == 'interest') {
      var index = this.active_tags_interest.indexOf(slug);
      if(index !== -1) {
        this.active_tags_interest.splice(index, 1);
      } else {
        this.active_tags_interest.push(slug);
      }
    }

    this.activityService.getActivities((response) => {
      this.activities = response.data;
      this.next_page_url = response.next_page_url;
      this.loading = false;
    },{ filter: this.active_tags, stage: this.active_tags_stage, time: this.active_tags_time, type: this.active_tags_type, interest: this.active_tags_interest}, this.next_page_url);

    this.getResultCount();
  }

  getData(event=null) {
    this.activityService.getActivities((response) => {
      if(event){
        event.target.complete();
        if(response.next_page_url == null) {
          event.target.disabled = true;
        }
      }
      this.next_page_url = response.next_page_url;
      this.activities.push(...response.data);
    },{ filter: this.active_tags, stage: this.active_tags_stage, time: this.active_tags_time, type: this.active_tags_type, interest: this.active_tags_interest}, this.next_page_url);
  }

  resetData(scrollup=true) {
    this.activities = [];
    this.next_page_url = null;
    this.infiniteScroll.disabled = false;
    if(scrollup) {
      this.content.scrollToTop(400);
    }
  }

  getUsedInterestTags() {
    this.activityService.getUsedInterestTags((response) => {
      this.used_intrest_tags = response;

      this.buttons = this.buttons.filter((e) => {
        return this.used_intrest_tags.indexOf(e.title) !== -1;
      });

    },{});
  }

  getResultCount() {
    this.activityService.getResultCount((response) => {
      this.totalNumberOfResults = response.total_results;
    },{ filter: this.active_tags, stage: this.active_tags_stage, time: this.active_tags_time, type: this.active_tags_type, interest: this.active_tags_interest});
  }

  gotoActivityDetail(activity) {
    if (!this.canViewAllActivities && !activity.is_free) {
      console.log("Show Upgrade Screen");
      this.showUpgradeScreen(1);
      return;
    }
    this.router.navigate(['/tabs/activity-finder/activity-detail'], {state: activity});
  }

  toggleSaved() {

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

  async presentPal() {
    if(!this.canViewPal) {
      return;
    }
    console.log('present pal');
    // this.router.navigate(['/pal', { source: 'dashboard' }]);

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
}


