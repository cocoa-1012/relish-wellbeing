import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SERVER_URL } from 'src/config';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private readonly httpClient: HttpClient) { }


  getSummaryData(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/summary";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getReportsData(cb, postdataobj, next_page_url=null) {
    var url = next_page_url;
    if(!url) {
      url = SERVER_URL + "/api/v2/reports/list";
    }

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getReportsDataById(cb, id=null) {
    var url = SERVER_URL + "/api/v2/reports/detail";

    let request = this.httpClient.post(url, {id: parseInt(id)})
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getResidentialReportsDataById(cb, id=null) {
    var url = SERVER_URL + "/api/v2/reports/residential-report";

    let request = this.httpClient.post(url, {id: parseInt(id)})
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  deleteReportById(cb, id=null) {
    var url = SERVER_URL + "/api/v2/reports/delete";

    let request = this.httpClient.post(url, {id: parseInt(id)})
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getOutstandingData(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/outstanding";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }


  createOrUpdateReportData(cb, postdataobj, ecb) {
    var url = SERVER_URL + "/api/v2/reports/create-or-update";
    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      }, (err) => {
        ecb(err);
      });
    return request;
  }


  reportActivitySearch(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/activity-search";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getCustomActivityTypes(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/activity-types";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  addCustomReportActivity(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/create-custom-report-activity";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getCarehomeStaff(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/carehome-staff";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getCarehomeResidents(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/carehome-residents";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getSelectedCarehomeResidentialReports(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/residential-reports";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getFormsDynamicLists(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/dynamic-lists";
    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getPercentageOfResidentsAttending(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/graphs/percentage-of-residents-attending";
    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getActivityBonusBreakdown(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/graphs/activity-bonus-breakdown";
    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getActivityTimeDelivered(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/reports/graphs/activity-time-delivered";
    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  emailReport(cb, postdataobj) {
    var url = SERVER_URL + "/api/report/email";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  emailReports(cb, postdataobj) {
    var url = SERVER_URL + "/api/report/emailcollection";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }



}
