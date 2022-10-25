import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SERVER_URL } from 'src/config';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private readonly httpClient: HttpClient) { }


  calendar(cb, year, month) {
    var url = SERVER_URL + "/api/v2/events/calendar";

    let request = this.httpClient.post(url, {year, month})
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }


  addEvent(cb, data, ecb) {
    var url = SERVER_URL + "/api/v2/events/add";

    let request = this.httpClient.post(url, { ...data }).subscribe((res) => {
      cb(res);
    }, (err) => {
      ecb(err);
    });
    return request;
  }

  editEvent(cb, data, ecb) {
    var url = SERVER_URL + "/api/v2/events/edit";

    let request = this.httpClient.post(url, { ...data }).subscribe((res) => {
      cb(res);
    }, (err) => {
      ecb(err);
    });
    return request;
  }

  deleteEvent(cb, data, ecb) {
    var url = SERVER_URL + "/api/v2/events/delete";

    let request = this.httpClient.post(url, { ...data }).subscribe((res) => {
      cb(res);
    }, (err) => {
      ecb(err);
    });
    return request;
  }

  sendCalendar(cb) {
    var url = SERVER_URL + "/api/v2/events/calendar/email";

    let request = this.httpClient.post(url, {})
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

}
