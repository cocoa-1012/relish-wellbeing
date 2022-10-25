import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-activity-skeleton',
  templateUrl: './activity-skeleton.component.html',
  styleUrls: ['./activity-skeleton.component.scss'],
})
export class ActivitySkeletonComponent implements OnInit {

  @Input() count;

  constructor() { }

  ngOnInit() {}

  emptyArray(n: number): any[] {
    return Array(n);
  }

}
