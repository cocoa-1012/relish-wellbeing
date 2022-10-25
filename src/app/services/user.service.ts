import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { SERVER_URL } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //has the data required been loaded
  public static hasLoaded: boolean = false;

  public static isBasic: boolean;
  public static canReport: boolean;
  public static canChat: boolean;
  public static isFamily: boolean;
  public static isRelative: boolean;
  public static isCarehomeUser: boolean;
  public static expired: boolean;
  public static app_user_id: number;
  public static carehome = null;

  private static timer;

  public static canViewFeaturedActivities: boolean;
  public static canViewDashboardGraphs: boolean;
  public static canViewPal: boolean;
  public static canViewVideos: boolean;
  public static canViewTutorials: boolean;
  public static canViewAllActivities: boolean;
  public static canViewEvents: boolean;
  public static canAddEvents: boolean;


  constructor(private readonly httpClient: HttpClient) { }


  me(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/me";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        this.setStaticVariables(data);
        cb(data);
      });
    return request;
  }

  private setStaticVariables(data) {
    console.log('settings static variables', data);
    UserService.isBasic = data.package.is_basic;
    if (data.package.title == "Package C" || data.package.title == "Package D") {
      UserService.canReport = true;
    } else {
      UserService.canReport = false;
    }

    if(data.organisation_type == 2) {
      UserService.isFamily = true;
    } else {
      UserService.isFamily = false;
    }

    if(data.type == 'family') {
      UserService.isRelative = true;
    } else {
      UserService.isRelative = false;
    }

    UserService.expired = data.expired;
    UserService.app_user_id = data.id;
    UserService.carehome = data.carehome;

    UserService.isCarehomeUser = !UserService.isRelative && !UserService.isFamily;

    UserService.canChat = data.package.supports_chat;

    // this.carehome = data.carehome.name;
    // this.package = data.carehome.package.title;
    // this.package_description = data.carehome.package.description;
    // this.package_headline = data.carehome.package.headline;
    // this.expires = new Date(data.carehome.package_end_date).toDateString();
    // this.expired = data.expired;


    //feature controls

    //dashboard featured activities
    if(UserService.isRelative || data.package.title == "Package A" || UserService.isFamily) {
      UserService.canViewFeaturedActivities = true;
    } else {
      UserService.canViewFeaturedActivities = false;
    }

    //dashboard graphs
    if(UserService.isCarehomeUser) {
      UserService.canViewDashboardGraphs = true;
    } else {
      UserService.canViewDashboardGraphs = false;
    }

    if(!UserService.expired) {
      UserService.canViewPal = true;
    } else {
      UserService.canViewPal = false;
    }

    if(!UserService.expired) {
      UserService.canViewVideos = true;
    } else {
      UserService.canViewVideos = false;
    }

    if(!UserService.isRelative) {
      UserService.canViewTutorials = true;
    } else {
      UserService.canViewTutorials = false;
    }

    if(!UserService.isFamily) {
      UserService.canViewAllActivities = true;
    } else {
      UserService.canViewAllActivities = false;
    }


    if(!UserService.isBasic && !UserService.isRelative) {
      UserService.canAddEvents = true;
      UserService.canViewEvents = true;
    } else {
      UserService.canAddEvents = false;
      if(UserService.isRelative) {
        UserService.canViewEvents = true;
      } else {
        UserService.canViewEvents = false;
      }
    }



    UserService.hasLoaded = true;




  }

  static ready = new Promise<void>((resolve, reject) => {
    if(UserService.hasLoaded) {
      resolve();
    } else {
      UserService.timer = setInterval(() => {
        if(UserService.hasLoaded) {
          clearInterval(UserService.timer);
          resolve();
        }
      }, 100);
    }
  });

  getFeaturedActivities(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/dashboard/featured";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getVideos(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/dashboard/videos";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getTutorials(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/dashboard/tutorials";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getActivityCountData(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/dashboard/activity-count";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getActivityFeedbackData(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/dashboard/activity-feedback";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getPercentageOfResidentsEngagedData(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/dashboard/percentage-of-residents-engaged";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

}
