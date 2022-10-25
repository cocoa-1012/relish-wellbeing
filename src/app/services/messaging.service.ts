import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SERVER_URL } from 'src/config';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private readonly httpClient: HttpClient) { }


  getMessages(cb, postdataobj, next_page_url=null) {
    var url = next_page_url;
    if(!url) {
      url = SERVER_URL + "/api/v2/residents/messaging/messages";
    }

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  markChatsAsRead(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/residents/messaging/mark-chats-as-read";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  sendMessage(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/residents/messaging/send";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }



}
