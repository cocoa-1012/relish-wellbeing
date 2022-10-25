import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router } from '@angular/router';
import { MbscSelect, MbscDatetimeOptions } from '@mobiscroll/angular';
import { ReportService } from 'src/app/services/report.service';
import { v1 as uuidv1 } from 'uuid';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SERVER_URL } from 'src/config';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-manage-report',
  templateUrl: './manage-report.page.html',
  styleUrls: ['./manage-report.page.scss'],
})
export class ManageReportPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(MbscSelect) mbscSelect: MbscSelect;

  @Input() current_report: any;

  slideOpts = {
    initialSlide: 0,
  };

  slideIndex: any = 0;
  result = 0;

  loader: any;
  loadDelay: any;
  loaded = false;
  isEditting = false;


  isItemAvailable: boolean = false;
  activityItems: any = [];
  name = "";
  ignoreNextChange: boolean = false;
  dateTime: any;

  whenSettings: MbscDatetimeOptions = {
    dateWheels: '|D M d|',
    returnFormat: 'iso8601',
    onSet: () => {
      this.enableButtons()
    },
  };

  image = null;

  isNextDisabled: boolean;
  isBackDisabled: boolean;
  isSaveDisabled: boolean;

  /***/
  isReportActivityListReady: boolean = false;
  reportActivityList = [];
  customActivityTypes = [];
  loading_staff = false;
  matchingStaff = [];
  selectedStaff = [];

  public selectAllResidentsInInviteListCheckedbox: boolean = false;
  selectAllResidentsIndeterminateState = null;
  loading_residents = false;
  matchingResidents = [];
  matchingAbsentResidents = [];
  selectedResidents = [];
  selectedAbsentResidents = [];


  get custom_activity_title() {
    return this.custom_activity.get('title');
  }
  get custom_activity_type() {
    return this.custom_activity.get('type');
  }

  custom_activity: FormGroup = this.fb.group({
    title: ['', Validators.required],
    type: ['', Validators.required],
  });

  uuid: String;
  uploadProgress: number;

  public isLastPage: boolean = false;

  report = {
    id:null,
    version: 2,
    selectedReportActivity: null,
    group: 'group',
    when: null,
    success: null,
    thoughts:null,
  }

  residentialReports: any;
  public observations:any = [];
  public durations:any = [];
  public bonuses:any = [];
  public absentReasons:any = [];


  constructor(
    private router: Router,
    public modalController: ModalController,
    public reportService: ReportService,
    private fb: FormBuilder,
    private transfer: FileTransfer,
    public toastController: ToastController,
    private authService: AuthenticationService,
    public loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController,

  ) {
    this.isNextDisabled = true;
    this.isBackDisabled = true;
    this.isSaveDisabled = true;
  }

  ngOnInit() {
    if(this.current_report) {
      this.isEditting = true;
      if (this.current_report.complete === 0 || this.current_report.complete === 1) {
        //at this point, you want to restore any data you have.
        this.report.selectedReportActivity = this.current_report.selectedReportActivity;
        this.selectedStaff = this.current_report.selectedStaff;
        if (this.report.when){
          this.report.when = new Date(this.report.when);//then
        } else {
          this.report.when = new Date();//now
        }
        this.report.success = this.current_report.success;
        this.report.thoughts = this.current_report.thoughts;
        this.image = this.current_report.image;
        this.selectedResidents = this.current_report.selectedResidents;
        this.selectedAbsentResidents = this.current_report.selectedAbsentResidents;
        this.residentialReports = this.current_report.residentialReports;
        if(this.current_report.id) {
          this.report.id = this.current_report.id;
        }
        this.report.group = this.current_report.group;

        this.reportService.getSelectedCarehomeResidentialReports((data) => {
          this.residentialReports = data;
          if (this.residentialReports.length == 0) {
            this.isNextDisabled = true;
            //you never selected any residents
          } else {
            this.slides.update();
          }
        }, {selectedResidents:this.selectedResidents, id: this.report.id});

      }
    }
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
    this.searchReportActivity(null, true);//get initial list
  }

  filterActivityList(ev: any) {
    const val = ev.target.value;
    this.searchReportActivity(val);
  }

  searchReportActivity(term=null, initialLoad = false) {
    this.reportService.reportActivitySearch((data) => {
      this.isReportActivityListReady = true;
      this.reportActivityList = data;

      if(this.reportActivityList.length == 0 && this.customActivityTypes.length == 0) {
        this.loadCustomActivityTypes();
      }
      if(initialLoad) {
        this.enableButtons();
      }
    }, {'term': term });
  }

  loadCustomActivityTypes() {
    this.reportService.getCustomActivityTypes((data) => {
      this.customActivityTypes = data;
    }, {});
  }

  addCustomActivity() {
    this.reportService.addCustomReportActivity((data) => {

      this.report.selectedReportActivity = data.id;
      this.enableButtons();
      this.next();

    }, this.custom_activity.value);
  }


  getStaffList() {
    this.loading_staff = true;
    this.reportService.getCarehomeStaff((data) => {
      data.forEach((staff, index) => {
        //restore selected if any
        if(this.selectedStaff.indexOf(staff.value) !== -1) {
          data[index].checked = true;
        }
      });
      this.matchingStaff = data;
      this.loading_staff = false;
    }, {});
  }

  selectAllResidentsInInviteList() {
    this.matchingResidents.forEach((resident) => {
      resident.checked = this.selectAllResidentsInInviteListCheckedbox;
    });
    this.updateResidents();
  }

  getAbsentResidentsList() {
    var absentResidents = [];
    var prevChecked = [];

    this.matchingAbsentResidents.forEach(resident => {
      if(resident.checked) {
        prevChecked.push(resident.value);
      }
    });


    this.matchingResidents.forEach(resident => {
      //possible to save previous selection
      if(resident.checked) {
        absentResidents.push({
          checked: this.selectedAbsentResidents.indexOf(resident.value) != -1 ? true: false,
          image: resident.image,
          text: resident.text,
          value: resident.value
        });
      }
    });

    absentResidents.forEach(resident => {
      if(prevChecked.indexOf(resident.value) >= 0) {
        resident.checked = true;
      }
    });

    this.matchingAbsentResidents = absentResidents;

  }

  getResidentsList() {
    this.loading_residents = true;
    this.reportService.getCarehomeResidents((data) => {
      data.forEach((resident, index) => {
        //restore selected if any
        if(this.selectedResidents.indexOf(resident.value) !== -1) {
          data[index].checked = true;
        }
      });
      this.matchingResidents = data;
      this.loading_residents = false;

    }, {});
  }

  getFormsDynamicLists() {
    this.reportService.getFormsDynamicLists((data) => {
      this.observations = data.observations
      this.durations = data.durations;
      this.bonuses = data.bonuses;
      this.absentReasons = data.absentReasons
    }, {});
  }

  async dismiss() {
    const actionSheet = await this.actionSheetController.create({
      header: `Are you want to cancel ${this.isEditting ? 'editing' : 'creating'} for the activity?`,
      buttons: [{
        text: 'Cancel',
        role: 'destructive',
        handler: () => {
          this.modalController.dismiss({
            'dismissed': true
          });
        }
      }, {
        text: 'Continue',
        role: 'cancel',
        handler: () => {
          
        }
      }]

    });

    await actionSheet.present();

  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Creating report...',
      duration: 5000
    });
    await this.loader.present();
  }

  saveAndExit() {
    this.presentLoading();

    var finalReport = {
      ...this.report,
      selectedStaff: this.selectedStaff,
      image: this.image,
      selectedResidents: this.selectedResidents,
      selectedAbsentResidents: this.selectedAbsentResidents,
      residentialReports: this.residentialReports,
      complete: null,
      uuid: this.uuid,
    };

    if(this.isLastPage) {
      //save and complete (show the completed bit)
      finalReport.complete = true;
    } else {
      //save and continue later, simply close the model
      finalReport.complete = false;
    }

    this.reportService.createOrUpdateReportData((data) => {
      this.modalController.dismiss({
        'dismissed': true
      });
      if (this.loader) {
        this.loader.dismiss();
      }
      this.router.navigateByUrl('tabs/reports', {replaceUrl:true});
      this.showMessageToast();
    }, finalReport, function() {
      alert('There was an issue creating the report');
    });
  }

  async showMessageToast() {
    const toast = await this.toastController.create({
      message:"Activity report saved - to view see completed activities",
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }


  updateStaff() {
    var selected = [];
    this.matchingStaff.forEach(staff => {
      if(staff.checked) {
        selected.push(staff.value);
      }
    });
    this.selectedStaff = selected;
    this.enableButtons();
  }

  updateAbsentResidents() {
    var selected = [];
    this.matchingAbsentResidents.forEach(resident => {
      if (resident.checked) {
        selected.push(resident.value);
      }
    });
    this.selectedAbsentResidents = selected;
    this.enableButtons();
  }

  updateResidents() {
    var selected = [];
    this.matchingResidents.forEach(resident => {
      if (resident.checked) {
        selected.push(resident.value);
      }
    });
    this.selectedResidents = selected;

    if(this.selectedResidents.length == 0) {
      this.selectAllResidentsIndeterminateState = false;
      this.selectAllResidentsInInviteListCheckedbox = false;
    }
    if(this.selectedResidents.length > 0) {
      this.selectAllResidentsInInviteListCheckedbox = false;
      this.selectAllResidentsIndeterminateState = true;
    }
    if(this.selectedResidents.length == this.matchingResidents.length) {
      this.selectAllResidentsInInviteListCheckedbox = true;
      this.selectAllResidentsIndeterminateState = false;
    }

    this.getAbsentResidentsList();
    this.enableButtons();
  }

  slideDidChange(ev) {
    this.slides.getActiveIndex().then((value) => {
      this.slideIndex = value.toString();
      console.log("sliderIndex ==>", this.slideIndex);
      this.enableButtons();

      if((this.slideIndex == 1 || this.slideIndex == 2) && this.matchingStaff.length == 0) {
        this.getStaffList();
      }

      if((this.slideIndex == 5 || this.slideIndex == 6) && this.matchingResidents.length == 0) {
        this.getResidentsList();
      }

      if(this.slideIndex == 7) {
        if(this.matchingAbsentResidents.length == 0) {
          this.getAbsentResidentsList();
        }
      }

    });
  }

  enableButtons() {
    let index = parseInt(this.slideIndex);
    if(index >= 1) {
      this.isBackDisabled = false;
    }
    switch (index) {
      case 0:
        if(this.report.selectedReportActivity) {
          this.isNextDisabled = false;
        } else {
          this.isNextDisabled = true;
        }
        break;
      case 1:
        if(this.report.group) {
          this.isNextDisabled = false;
        } else {
          this.isNextDisabled = true;
        }
        break;
      case 2:
        this.isNextDisabled = true;
        if (this.selectedStaff && this.selectedStaff.length > 0) {
          this.isNextDisabled = false
        } else {
          this.isNextDisabled = true
        }
        break;
      case 3:
        if (!this.report.when) {
          this.report.when = new Date();
        }
        this.isNextDisabled = false;
        break;
      //just optional
      case 4:
      case 5:
        this.isNextDisabled = false;
        break;
      //^ optionals - no specific validation
      case 6:
        this.isNextDisabled = true;
        if(this.selectedResidents && this.selectedResidents.length > 0) {
          this.isNextDisabled = false;
        }
        break;
      case 7:
        if (this.selectedResidents.length) {
          this.isNextDisabled = false;
          this.reportService.getSelectedCarehomeResidentialReports((data) => {
            this.residentialReports = data;
            if (this.residentialReports.length == 0) {
              this.isNextDisabled = true;
              //you never selected any residents
            } else {
              this.slides.update();
            }
          }, {selectedResidents:this.selectedResidents, id: this.report.id});
        } else {
          this.isNextDisabled = true;
        }
        break;
      case 8:
        if(this.observations.length == 0 || this.durations.length == 0 || this.bonuses.length == 0 || this.absentReasons.length == 0) {
          this.getFormsDynamicLists();
        }
        this.isNextDisabled = false;
        break;
    }

    if(index > 2) {
      this.isSaveDisabled = false;
    } else {
      this.isSaveDisabled = true;
    }

    this.slides.isEnd().then((isEnd) => {
      if (isEnd && index != 7) {
        this.isLastPage = true;
      } else {
        this.isLastPage = false;
      }
    });
  }

  isActiveClass(x, y, z) {
    return (x.indexOf(y) > -1 ? 'active' : '') + ' ' + z;
  }

  isActive(x, y, z) {
    return (x.indexOf(y) > -1 ? true : false);
  }

  toggleObservation(slug, selectedindex) {

    var index = this.residentialReports[selectedindex].observations.indexOf(slug);
    if (index === -1) {
      this.residentialReports[selectedindex].observations.push(slug);
    } else {
      this.residentialReports[selectedindex].observations.splice(index, 1);
    }
  }

  setDuration(duration, selectedindex) {
    this.residentialReports[selectedindex].duration = duration;
  }

  setAbsentReason(absent_reason, selectedindex) {
    this.residentialReports[selectedindex].absent_reason = absent_reason;
  }

  toggleBonus(bonus, selectedindex) {
    var index = this.residentialReports[selectedindex].bonuses.indexOf(bonus);
    if (index === -1) {
      this.residentialReports[selectedindex].bonuses.push(bonus);
    } else {
      this.residentialReports[selectedindex].bonuses.splice(index, 1);
    }
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  back() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  nameSelected(selected: string) :void {
    this.name = selected;
    this.isItemAvailable = false;
    this.ignoreNextChange = true;
    this.isNextDisabled = false;
  }

  changeGrouping(ev) {
    this.report.group = ev.detail.value;
    this.enableButtons();
  }

  onDateChange() {
    console.log("date=>", this.dateTime);
  }

  async getPictureViaCamera() {

    await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    }).then((imageUrl) => {
      console.log(imageUrl);
      this.uploadImageToServer(imageUrl.path);
    }, (err) => {
      // Handle error
      console.log('Error in getPictureViaCamera');
      console.error(err);
    });

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
      fileTransfer.upload(path, remote + "/api/v2/reports/upload-image", options).then((data) => {
        this.uploadProgress = 1;
        console.log(data);
        let response = JSON.parse(data.response);
        console.log(response);
        this.image = response.url;

        this.presentToastWithMessage("Uploaded completed", 'Report image has been uploaded', 3000, 'success');
      }, (err) => {
        // error
        console.error(err);
        this.uploadProgress = 0;
        this.presentToastWithMessage("Uploaded failed", 'Report image could not be uploaded', 5000, 'danger');

      });

    });

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


  viewReport() {
    this.modalController.dismiss(this.result);
    // this.router.navigate(['/tabs/reports/report-detail', {item: this.temp}]);
  }
}
