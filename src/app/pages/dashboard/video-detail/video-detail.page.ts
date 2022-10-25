import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  styleUrls: ['./video-detail.page.scss'],
})
export class VideoDetailPage implements OnInit {

  video: any;
  filteredVideo: any;
  isTutorial: any;

  title: string = 'Video Title ...';
  description: string = "Description ...";
  public video_id;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.video = this.route.snapshot.paramMap.get('item');
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title');
      this.video_id = params.get('id');
      this.isTutorial = params.get('isTutorial');
      this.getVideoData(this.video_id);
      console.log("filtered Video", this.filteredVideo);
      setTimeout(() => {
        this.video = this.filteredVideo[0];
      }, 2000);
    });
  }
  getVideoData(id) {
    if (this.isTutorial === "true") {
      this.userService.getTutorials((data) => {
        this.filteredVideo = data.filter((item) => {
          return (item.id == id);
        });
      }, {});
    } else {
      this.userService.getVideos((data) => {
        this.filteredVideo = data.filter((item) => {
          return (item.id == id);
        });
      }, {});
    }
  }
}
