import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-image-shows',
  templateUrl: './image-shows.component.html',
  styleUrls: ['./image-shows.component.scss'],
})

export class ImageShowsComponent implements OnInit {
  public image_Url: string;
  constructor(
    public modalController: ModalController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    this.image_Url = this.navParams.data.image;
    console.log("Image: ", this.image_Url);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}