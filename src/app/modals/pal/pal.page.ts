import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSlides, ModalController } from '@ionic/angular';
import { PalService } from 'src/app/services/pal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pal',
  templateUrl: './pal.page.html',
  styleUrls: ['./pal.page.scss'],
})
export class PalPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  constructor(
    public palService: PalService,
    public modalController: ModalController,
    public alertCtrl: AlertController,
    public userService: UserService,
  ) { }

  slideOpts = {
    initialSlide: 0,
  };

  slideIndex: any = 0;
  public isLastPage: boolean = false;
  public isLastPageModeOne: boolean = false;

  answers: any = [];
  result = 0;
  @Input() mode: Number = 0; //mode 1 will show allow pal to add residents
  selectedResidents: any = [];
  public matchingResidents: any = [];

  isBasic = true;
  canReport = false;
  isFamily = true;

  progress = 0;

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);

    this.isBasic = UserService.isBasic;
    this.canReport = UserService.canReport;
    this.isFamily = UserService.isFamily;

    if(!this.canReport) {
      this.mode = 0;
    }

    this.loadQuestions();
    this.loadResidents();
  }

  questions: any = [];
  residents: any = [];


  loadQuestions() {
    this.palService.getPalQuestions((data) => {
      this.questions = data;
    },{});
  }

  loadResidents() {
    this.palService.getResidents((data) => {
      this.residents = data;
      data.forEach((resident, index) => {
        //restore selected if any
        if (this.selectedResidents.indexOf(resident.value) !== -1) {
          data[index].checked = true;
        } else {
          data[index].checked = false;
        }
      });
      this.matchingResidents = data;
    },{});
  }

  dismiss() {
    this.modalController.dismiss(-1);
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

  complete() {
    this.modalController.dismiss(this.result);
  }

  changeResidentsPAL() {
    this.palService.changeResidentsPAL((data) => {
      this.complete();
    }, {
      'selectedResidents' : this.selectedResidents,
      'activity_level': this.result,
    }, (data) => {
      alert("Something went wrong :(")
    });
  }

  isActive(x, y) {
    return this.answers[x] == y ? true : false;
  }

  setAnswer(x, y) {
    this.answers[x] = y;
    this.next();
  }

  updateResidents() {
    var selected = [];
    this.matchingResidents.forEach(resident => {
      if (resident.checked) {
        selected.push(resident.id);
      }
    });
    this.selectedResidents = selected;
  }

  slideChange(ev) {
    this.slides.getActiveIndex().then((value) => {
      this.slideIndex = value.toString();
      //-1 for first and last page and -1 for 0 index
      if (this.slideIndex == this.questions.length + 1) {
        this.isLastPage = true;
        this.calculateResult();
      } else {
        this.isLastPage = false;
      }

      if(this.slideIndex == this.questions.length + 2) {
        this.isLastPageModeOne = true;
      } else {
        this.isLastPageModeOne = false;
      }
      if(this.slideIndex <= this.questions.length) {
        this.progress = this.slideIndex / this.questions.length;
      } else {
        this.progress = 0;
      }
    });
  }

  calculateResult() {
    var total = 0;
    this.answers.forEach((answer, index) => {
      let weight = parseFloat(this.questions[index].answers[answer].weight);
      total += weight;
    });

    this.result = Math.round(total/this.questions.length);
    console.log("PAL result", this.result);
  }
}
