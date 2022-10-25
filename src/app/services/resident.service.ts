import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SERVER_URL } from 'src/config';


@Injectable({
  providedIn: 'root'
})
export class ResidentService {

  constructor(private readonly httpClient: HttpClient) { }


  getSummaryData(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/residents/summary";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getResidentsData(cb, postdataobj, next_page_url=null) {
    var url = next_page_url;
    if(!url) {
      url = SERVER_URL + "/api/v2/residents/list";
    }

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }


  getMessagesList(cb, postdataobj, next_page_url=null) {
    var url = next_page_url;
    if(!url) {
      url = SERVER_URL + "/api/v2/residents/messaging/list";
    }

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getMessagesUnreadCount(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/residents/messaging/unread-count";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getResidentsDataById(cb, id=null) {
    var url = SERVER_URL + "/api/v2/residents/detail";

    let request = this.httpClient.post(url, {id: parseInt(id)})
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getResidentialDataByRange(cb, id, range) {
    var url = SERVER_URL + "/api/v2/residents/residential-reports-range";

    let request = this.httpClient.post(url, {id:id, range: range})
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  archiveResidentById(cb, id=null) {
    var url = SERVER_URL + "/api/v2/residents/archive";

    let request = this.httpClient.post(url, {id: parseInt(id)})
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  createOrUpdateResidentData(cb, postdataobj, ecb) {
    var url = SERVER_URL + "/api/v2/residents/create-or-update";
    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      }, (err) => {
        ecb(err);
      });
    return request;
  }


  emailResidentialReport(cb, postdataobj) {
    var url = SERVER_URL + "/api/resident/email";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  emailResidentialReports(cb, postdataobj) {
    var url = SERVER_URL + "/api/resident/emailcollection";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }


  getRelativesData(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/relatives/list";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

}
