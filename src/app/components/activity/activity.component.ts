import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {

  @Input() activity;
  @Input() isBasic;

  constructor() { }

  ngOnInit() {}

  failedImageLoad(ev) {
    this.activity.thumbnail = "/assets/placeholder.jpg";
  }
}
