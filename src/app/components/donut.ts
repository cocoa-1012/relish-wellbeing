import { Component, Input } from '@angular/core';

@Component({
  selector: 'donut',
  template: `
  <svg height="100%" width="100%" [attr.viewBox]="viewBox">
    <g>
     <circle *ngFor="let item of items;let i=index" [attr.cx]="center"
     [attr.cy]="center" [attr.r]="radius" fill="transparent" [attr.stroke-width]="width"
     [attr.stroke-dasharray]="perimeter" [attr.stroke-dashoffset]="getOffset(i)" [attr.stroke]="item.color"/>
     </g>
     <g *ngIf="centerText">
     <text  [attr.fill]="fontColor" [attr.font-size]="fontSize" text-anchor="middle" [attr.x]="center" [attr.y]="center">
     <tspan [attr.x]="center" dy="0">{{centerText.name}}</tspan>
     <tspan [attr.x]="center" [attr.dy]="fontSize">{{centerText.value}}</tspan>
     </text>
     </g>
     <g *ngIf="showPercentage">
      <text [attr.x]="center" [attr.y]="center + 4" style="font-size: 0.8rem;text-anchor: middle;fill:#3ba664;font-weight: bold;">{{ percentLabel }}<tspan style="font-size: 0.6em;">%</tspan></text>
     </g>
  </svg>`
})
export class donutComponent {
  @Input() items: Array<Item> = [];
  @Input() radius: number = 50;
  @Input() width: number = 20;
  @Input() centerText: { name: string, value: string };
  @Input() fontColor: string = "black";
  @Input() fontSize: number = 10;
  @Input() showPercentage: boolean = false;
  @Input() percentageKey: string = "Happy";

  constructor() {
  }

  get perimeter() {
    return Math.PI * 2 * this.radius;
  }

  get total() {
    return this.items.map(a => a.count).
      reduce((x, y) => x + y);
  }

  get center() {
    return this.radius + (this.width / 2);
  }

  get viewBox() {
    return "0 0 " + (this.center * 2).toString() + " " + (this.center * 2).toString()
  }

  get percentLabel() {
    if(this.items.length == 0) {
      return 0;
    }
    var total = this.items.map(a => a.count).reduce((x, y) => x + y);
    var percent = 0;
    this.items.forEach(element => {
      if (element.name == this.percentageKey) {
        percent = Math.floor((element.count / total) * 100);
      }
    });
    return percent;
  }

  getOffset(index: number): number {

    let percent: number = index === 0 ? index : this.items.slice(0, index).map(a => a.count).
      reduce((x, y) => x + y);
    return this.perimeter * percent / this.total;

  }
}

export interface Item {
  name: string;
  count: number;
  color: string;
}
