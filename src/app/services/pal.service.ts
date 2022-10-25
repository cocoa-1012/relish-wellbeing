import { Injectable } from '@angular/core';
import { SERVER_URL } from 'src/config';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class PalService {

  constructor(private readonly httpClient: HttpClient) { }


  getPalQuestions(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/pal/questions";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  getResidents(cb, postdataobj) {
    var url = SERVER_URL + "/api/v2/pal/residents";

    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      });
    return request;
  }

  changeResidentsPAL(cb, postdataobj, ecb) {
    var url = SERVER_URL + "/api/v2/pal/update-pal";
    let request = this.httpClient.post(url, postdataobj)
      .subscribe((data) => {
        cb(data);
      }, (err) => {
        ecb(err);
      });
    return request;
  }



}
