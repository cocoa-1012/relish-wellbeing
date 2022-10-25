import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SERVER_URL } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private readonly httpClient: HttpClient) { }


  getActivities(cb, postdataobj, next_page_url=null) {
    var url = next_page_url;
    if(!url) {
      url = SERVER_URL + "/api/v2/activity/finder";
    }

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }


  getResultCount(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/activity/finder/count";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getUsedInterestTags(cb, postdataobj) {
    var  url = SERVER_URL + "/api/v2/activity/get-used-interest-tags";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  emailResource(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/activity/email-resource";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  toggleSaveActivity(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/activity/toggle-save";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getSaveActivities(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/activity/saved";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }


}
