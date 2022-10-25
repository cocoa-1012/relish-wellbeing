import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResidentService } from 'src/app/services/resident.service';

@Component({
  selector: 'app-relatives',
  templateUrl: './relatives.page.html',
  styleUrls: ['./relatives.page.scss'],
})
export class RelativesPage implements OnInit {

  public residents = [];
  public loading_residents = true;


  constructor(
    public residentService: ResidentService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  gotoDetail(resident) {
    let title = resident.preferred_name ? resident.preferred_name : resident.first_name + ' ' + resident.last_name;
    this.router.navigate(['/tabs/relatives/' + resident.id, { title: title }]);
  }

  gotoMessages(resident) {
    resident.unread_messages_count = 0;
    let title = resident.preferred_name ? resident.preferred_name : resident.first_name + ' ' + resident.last_name;
    this.router.navigate(['/tabs/residents/' + resident.id + '/messages', { title: title, chat_room_id: resident.chat_room_id }], {replaceUrl: false});
  }

  ionViewDidEnter() {
    this.getRelativesData();
  }

  getRelativesData() {
    this.loading_residents = true;
    this.residentService.getRelativesData((response) => {
      this.residents = response;
      this.loading_residents = false;
    }, {});
  }



}
