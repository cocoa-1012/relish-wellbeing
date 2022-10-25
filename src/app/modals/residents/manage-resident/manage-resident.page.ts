import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResidentService } from 'src/app/services/resident.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { SERVER_URL } from 'src/config';
import { v1 as uuidv1 } from 'uuid';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-manage-resident',
  templateUrl: './manage-resident.page.html',
  styleUrls: ['./manage-resident.page.scss'],
})
export class ManageResidentPage implements OnInit {

  uploadProgress: number;
  uuid: String;
  image: String;
  edit_id: number;
  errors = {
    first_name: [],
    last_name: [],
    preferred_name: [],
    dob: [],
    activity_level: [],
    room_number: [],
  };

  resident: FormGroup = this.fb.group({
    // id: [null, Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    preferred_name: [''],
    dob: ['', Validators.required],
    activity_level: ['', Validators.required],
    room_number: [''],
  });


  constructor(public modalController: ModalController, private fb: FormBuilder,public loadingController: LoadingController, public residentService: ResidentService, public actionSheetController: ActionSheetController, private transfer: FileTransfer, public toastController: ToastController, private authService: AuthenticationService) { }

  ngOnInit() {

    // this.resident = new FormGroup({
    //   first_name: new FormControl()
    // });
  }


  async dismiss() {
    await this.modalController.dismiss({
      'dismissed': true
    });
  }

  save() {
    this.errors = {
      first_name: [],
      last_name: [],
      preferred_name: [],
      dob: [],
      activity_level: [],
      room_number: [],
    };
    console.log(this.resident.value);
    var data = this.resident.value;
    data.image = this.image;
    if(this.edit_id) {
      data.id = this.edit_id;
    }
    this.residentService.createOrUpdateResidentData((data) => {
      console.log(data);
      this.modalController.dismiss({
        'dismissed': true,
        reloadData: true
      });
    },{ ...data }, (data) => {
      this.errors = data.error.errors;
      console.log(this.errors);
    });
  }

  /* id */
  get id() {
    return this.edit_id;
  }
  set id(value) {
    this.edit_id = value;
  }

  /* first_name */
  get first_name() {
    return this.resident.get('first_name');
  }
  set first_name(value) {
    this.resident.patchValue({ first_name: value});
  }

  /* last_name */
  get last_name() {
    return this.resident.get('last_name');
  }
  set last_name(value) {
    this.resident.patchValue({ last_name: value});
  }

  /* preferred_name */
  get preferred_name() {
    return this.resident.get('preferred_name');
  }
  set preferred_name(value) {
    this.resident.patchValue({ preferred_name: value});
  }

  /* dob */
  get dob() {
    return this.resident.get('dob');
  }
  set dob(value) {
    this.resident.patchValue({ dob: value});
  }

  /* activity_level */
  get activity_level() {
    return this.resident.get('activity_level');
  }
  set activity_level(value) {
    this.resident.patchValue({ activity_level: value});
  }

  /* room_number */
  get room_number() {
    return this.resident.get('room_number');
  }
  set room_number(value) {
    this.resident.patchValue({ room_number: value});
  }

  /* imageURL */
  set imageURL(value) {
    this.image = value;
  }


  // async showAddImageMenu() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'Resident picture',
  //     buttons: [{
  //       text: 'Delete Photo',
  //       role: 'destructive',
  //       handler: () => {
  //         this.deleteCurrentPhoto();
  //       }
  //     }, {
  //       text: 'Take Photo',
  //       handler: () => {
  //         this.getPictureViaCamera();
  //       }
  //     }, {
  //       text: 'Choose Photo',
  //       handler: () => {
  //         this.getPictureViaPhotoLibrary();
  //       }
  //     }, {
  //       text: 'Cancel',
  //       role: 'cancel',
  //       handler: () => {
  //         console.log('Cancel clicked');
  //       }
  //     }]
  //   });
  //   await actionSheet.present();
  // }


  getPictureViaPhotoLibrary() {
    throw new Error('Method not implemented.');
  }
  async getPictureViaCamera() {

    await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      width:1024,
      height:1024,
    }).then((imageUrl) => {
      console.log(imageUrl);
      this.uploadImageToServer(imageUrl.path);
    }, (err) => {
      // Handle error
      console.log('Error in getPictureViaCamera');
      console.error(err);
    });



  }

  deleteCurrentPhoto() {
    throw new Error('Method not implemented.');
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

  uploadImageToServer(path) {

    //generate UUID to link images to profile
    if (!this.uuid) {
      this.uuid = uuidv1();
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.onProgress((event) => {
      var percentage = Math.floor(event.loaded / event.total * 100);
      this.uploadProgress = percentage;
    });

    //getting token
    this.authService.getToken().then((token) => {

      console.log('token is', token);
      console.log('uuid is', this.uuid);

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
      fileTransfer.upload(path, remote + "/api/v2/residents/upload-image", options).then((data) => {
        this.uploadProgress = 1;
        console.log(data);
        let response = JSON.parse(data.response);
        console.log(response);
        this.image = response.url;

        this.presentToastWithMessage("Uploaded completed", 'Resident image has been uploaded', 3000, 'success');
      }, (err) => {
        // error
        console.error(err);
        this.uploadProgress = 0;
        this.presentToastWithMessage("Uploaded failed", 'Resident image could not be uploaded', 5000, 'danger');

      });

    });

  }


  async archive() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to archive this resident',
      buttons: [{
        text: 'Archive',
        role: 'destructive',
        handler: () => {
          this.archiveResident();
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
      }]
    });

    await actionSheet.present();

  }


  async archiveResident() {

    const loading = await this.loadingController.create({
      message: 'Archiving resident',
      duration: 10000
    });
    await loading.present();

    this.residentService.archiveResidentById(() => {
      loading.dismiss();

      this.modalController.dismiss({
        'dismissed': true,
        reloadData: false,
        archived:true
      });

    }, this.id);
  }

}
