import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonInfiniteScroll, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { MessagingService } from 'src/app/services/messaging.service';
import { UserService } from 'src/app/services/user.service';
import Pusher from 'pusher-js';
import { Camera, CameraResultType } from '@capacitor/camera';
import { v1 as uuidv1 } from 'uuid';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { SERVER_URL } from 'src/config';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageShowsComponent } from "src/app/modals/image-shows/image-shows.component";
interface Message {
  type: string;
  app_user_id: number
  created_at: string
  deleted_at: string
  formatted_date: string
  from: string
  id: number
  long_ago: string
  message: string
  resident_id: number
  unread: number
  updated_at: string,
  mimetype: string
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  title: string = 'Resident';
  public resident_id;
  public chat_room_id;

  uuid: String;
  uploadProgress: number;
  image = null;
  mimetype = 'text/plain';
  loading: any;
  busy = true;

  pusher = null;
  inputMessage = null;
  messages: Array<Message> = [];
  public app_user_id: number = null;

  loading_messages: boolean;
  next_page_url: String;



  constructor(
    private route: ActivatedRoute,
    public messagingService: MessagingService,
    private authService: AuthenticationService,
    public toastController: ToastController,
    private transfer: FileTransfer,
    public loadingController: LoadingController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title');
      this.resident_id = params.get('id');
      this.chat_room_id = params.get('chat_room_id');
    });
    this.app_user_id = UserService.app_user_id;

  }

  ionViewDidEnter() {
    this.infiniteScroll.disabled = true;
    this.infiniteScroll.position = 'top';
    this.infiniteScroll.threshold = '100px';
    this.resetMessagesData();
    this.getMessagesData(null, true);
    this.initialisePusher();
    this.messagingService.markChatsAsRead((response) => {
      console.log("marking unread as read");
    }, { resident_id: this.resident_id});
  }

  ionViewDidLeave() {
    this.disconnectChat();
  }


  initialisePusher() {
    this.app_user_id = UserService.app_user_id;
    Pusher.logToConsole = true;

    this.pusher = new Pusher('f4bd9c1782d1aa4aef12', {
      cluster: 'eu'
    });

    var channel = this.pusher.subscribe('resident-messaging');
    channel.bind('nm-' + this.chat_room_id, (data) => {
      console.log('received event', data);
      this.pushMessageToView(data.message);
    });
  }

  disconnectChat() {
    this.pusher.disconnect();
    console.log('disconneted live chat');
  }

  resetMessagesData(scrollup=true) {
    this.messages = [];
    this.next_page_url = null;
    this.infiniteScroll.disabled = true;
    // if(scrollup) {
    //   this.content.scrollToTop(400);
    // }
  }

    async openImgModal(image) {
      console.log("open modal", image);
      const emailReportModal = await this.modalController.create({
        component: ImageShowsComponent,
        componentProps: {
          image: image
        }
      });
      await emailReportModal.present();
      const { role } = await emailReportModal.onDidDismiss();

    }
  getMessagesData(event=null, initial=false) {
    this.loading_messages = true;
    this.messagingService.getMessages((response) => {
      this.next_page_url = response.next_page_url;
      if(this.next_page_url == null) {
        this.infiniteScroll.disabled = true;
      }
      this.messages.push(...response.data);
      console.log( "messages: ", response.data);
      this.loading_messages = false;
      this.infiniteScroll.complete();
      if(initial) {
        setTimeout(() => {
          this.scrollToBottom();
        }, 1);
        setTimeout(() => {
          this.busy = false;
        }, 1000);
        setTimeout(() => {
          this.infiniteScroll.disabled = false;
        }, 300);
      }

      if(event) {
        event.target.complete();
        this.infiniteScroll.complete();
        if(response.next_page_url == null) {
          event.target.disabled = true;
        }
      }

    }, {resident_id: this.resident_id}, this.next_page_url);
  }

  pushMessageToView(message) {
    this.messages.unshift(message);

    console.log('pushing in view', message);

    setTimeout(() => {
      this.scrollToBottom();
    }, 500);

  }

  send() {
    if(this.busy) {
      console.log('busy sending previous message');
      return;
    }
    if(this.inputMessage) {
      this.busy = true;
      console.log("Sending message", this.inputMessage);
      this.messagingService.sendMessage((response) => {
        this.busy = false;
      }, {message: this.inputMessage, resident_id: this.resident_id, mimetype: 'text/plain' });
      this.inputMessage = '';
    }

    if(this.image) {
      this.busy = true;
      console.log("Sending image", this.image);
      this.messagingService.sendMessage((response) => {
        this.clearImage();
        setTimeout(() => {
          this.busy = false;
        }, 1000);
      }, {message: this.image, resident_id: this.resident_id, mimetype: this.mimetype });
    }

  }

  attachment() {
    this.getPictureViaCamera();
  }

  imageLoaded() {
    if(this.busy) {
      this.doWhenImageLoads();
    }
  }

  doWhenImageLoads = this.debounce(() => {
    this.scrollToBottom();
  }, 100, false);

  async getPictureViaCamera() {

    await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      width:1024,
      height:1024,
    }).then((imageUrl) => {
      this.mimetype = 'image/' + imageUrl.format;
      if(imageUrl.path) {
        this.uploadImageToServer(imageUrl.path);
      } else {
        this.uploadImageToServer(imageUrl.webPath);
      }
    }, (err) => {
      // Handle error
      console.log('Error in getPictureViaCamera');
      console.error(err);
    });


  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  scrollToBottom(duration=300) {
    console.log('scrolling to buttom', duration);
    this.content.scrollToBottom(duration);
  }


  async presentToastWithMessage(header, message, duration=3000, color="success") {

    var buttons;

    if(color == 'success') {
       buttons = [
        {
          side: 'start',
          icon: 'checkmark-circle-outline',
        }, {
          text: 'Dismiss',
          role: 'cancel',
        }
      ];
    }

    if(color == 'danger') {
       buttons = [
        {
          side: 'start',
          icon: 'alert-circle-outline',
        }, {
          text: 'Dismiss',
          role: 'cancel',
        }
      ];
    }

    const toast = await this.toastController.create({
      header: header,
      duration: duration,
      message: message,
      color: color,
      position: 'top',
      buttons: buttons
    });

    await toast.present();

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 10000
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  uploadImageToServer(path) {
    this.presentLoading();

    //generate UUID to link images to profile
    if (!this.uuid) {
      this.uuid = uuidv1();
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.onProgress((event) => {
      var percentage = Math.floor(event.loaded / event.total * 100);
      this.uploadProgress = percentage;
      this.loading.message = 'Uploading ' + this.uploadProgress + '%';
    });

    //getting token
    this.authService.getToken().then((token) => {
      var options: FileUploadOptions = {
        headers: {
          authorization: 'Bearer ' + token,
          accept: 'application/json',
        },
        params: {
          uuid:this.uuid,
        }
      }
      const remote = SERVER_URL;
      console.log(remote);
      console.log(path);
      fileTransfer.upload(path, remote + "/api/v2/residents/messaging/upload-image", options).then((data) => {
        this.uploadProgress = 1;
        console.log(data);
        let response = JSON.parse(data.response);
        console.log(response);
        this.image = response.url;
        this.loading.dismiss();
        this.presentToastWithMessage("Uploaded completed", 'Image has been uploaded', 3000, 'success');
      }, (err) => {
        // error
        console.error(err);
        this.uploadProgress = 0;
        this.loading.dismiss();
        this.presentToastWithMessage("Uploaded failed", 'Image could not be uploaded', 5000, 'danger');

      });

    });

  }

  clearImage() {
    this.image = null;
    this.mimetype = 'text/plain';
  }

}
