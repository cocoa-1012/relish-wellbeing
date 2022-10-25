import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-residential-report',
  templateUrl: './residential-report.page.html',
  styleUrls: ['./residential-report.page.scss'],
})
export class ResidentialReportPage implements OnInit {

  title: string = 'Residential Report';
  fname: string = "Resident";
  report_id = null;
  id = null;
  receivedItems: any;
  group: any = "";
  benefitsArr: any = [];
  bonusesArr: any = [];
  observations: any = [];
  observationsArray: any = { green: [], amber: [], red: [] };
  categoryArr: any = [];
  faceImg: string = "";
  avatar: string = "";
  activityLabel: string = "";
  activityImage: string = "";

  tempJson = {
    "green": [
      "laughed",
      "helped-others",
      "smiled",
      "asked-to-do-it-again",
      "interacted-with-others",
      "made-positive-comment",
      "clapped-hands",
      "appeared-relaxed",
      "more-animated",
      "cheered",
      "took-initiative"
    ],
    "amber": [
      "did-not-respond",
      "remained-silent",
      "no-change",
      "engaged-but-no-expression",
      "watched-the-activity-but-did-not-participate"
    ],
    "red": [
      "negative-comment",
      "negative-interaction",
      "became-agitated",
      "left-room",
      "too-hard",
      "too-easy"
    ],
  }

  public residential_report = {
    absent: 0,
    absent_reason: null,
    additionalObservations: null,
    bonuses: [],
    created_at: null,
    duration: null,
    id: null,
    observations: [],
    report_id: this.report_id,
    resident_id: null,
    self_feedback: 0,
    success: "unknown",
    updated_at: null,
  }

  public report = {
    absent_count: null,
    activityLabel: null,
    attended_count: null,
    complete: 1,
    customActivity: null,
    group: null,
    id: null,
    overview: [],
    residential_reports: [],
    success: null,
    thoughts: null,
    updated_at: null,
    updated_at_formatted: null,
    coordinated_by_formatted: null,
    image: null,
    imageUrl: null,
    selectedAbsentResidents: [],
    selected_benefit_slugged: [],
    uuid: null,
    version: 2,
    when: null,
    report_activity: null,
    when_formatted: null
  };

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title');
      this.fname = this.title.substr(0,this.title.indexOf(' ')) ? this.title.substr(0,this.title.indexOf(' ')) : this.title;
      this.report_id = params.get('report_id');
      this.id = params.get('id');
      this.avatar = params.get('imgURL') === 'null' ? "https://support.active-minds.org/img/default-avatar.png" : params.get('imgURL');
      this.getResidentialReportData(this.id);
    });
  }

  getResidentialReportData(id: any) {
    this.reportService.getResidentialReportsDataById((response) => {
      this.residential_report = response;
      this.report = response.report;
      this.bonusesArr = response.bonuses;
      this.observations = response.observations;
      this.observationsArray.green = this.tempJson.green.filter(element => this.observations.includes(element));
      this.observationsArray.amber = this.tempJson.amber.filter(element => this.observations.includes(element));
      this.observationsArray.red = this.tempJson.red.filter(element => this.observations.includes(element));
      this.group = response.report.group;
      this.faceImg = response.success == "indifferent" ? "/assets/faces/meh-regular.svg"
        : response.success == "happy" ? "/assets/faces/smile-regular.svg"
          : response.success == "sad" ? "/assets/faces/frown-regular.svg"
            : "/assets/faces/frown-regular-grey.svg";
      this.activityLabel = response.report.report_activity.report_activity_type.report_activity_type_category.name;
      this.activityImage = response.report.report_activity.report_activity_type.report_activity_type_category.thumbnail;
      this.benefitsArr = response.report.report_activity.report_activity_type.benefits;
    }, id);
  }


}
