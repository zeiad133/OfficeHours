import { Component, OnInit } from "@angular/core";
import { ScheduleService } from "./schedule.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
  providers: [ScheduleService]
})
export class ScheduleComponent implements OnInit {
  questions = [];
  requests = [];
  default = true;
  selectslot1 = false;
  id: any;
  start;
  myRequest;
  usersRequest;

  type = JSON.parse(sessionStorage.getItem("type"));
  flag;
  constructor(
    private scheduleService: ScheduleService,
    private modalService: NgbModal,
    private router: Router,
    private as: AuthService
  ) {
    if (!this.as.authorized) this.router.navigateByUrl("/home");
  }

  ngOnInit() {
    this.scheduleService.getQuestionsUsers().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.requests = res.data;
      }
    });

    this.scheduleService.getQuestions().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.questions = res.data;
      }
    });

    //   this.flag = false;
    //   sessionStorage.setItem("flag", JSON.stringify(this.flag));
    //
  }

  chat() {
    this.router.navigateByUrl("/chat");
  }
  reschedule(question) {
    const modalRef = this.modalService.open(NgbdModalContent5);
    sessionStorage.setItem("queSlot", JSON.stringify(question));
  }

  selectQuestion(question): void {
    sessionStorage.setItem("question", JSON.stringify(question));
    this.flag = false;
    sessionStorage.setItem("flag", JSON.stringify(this.flag));
  }
  startt(question) {
    var time = new Date(question.selectedSlot);
    var maxtime = new Date();
    return !(time > maxtime);
  }

  onClick() {
    var contactDiv = document.getElementById("done");
    scrollTo({ left: 0, top: contactDiv.offsetTop, behavior: "smooth" });
  }

  starttt(request) {
    var time = new Date(request.selectedSlot);
    var maxtime = new Date();
    return !(time > maxtime);
  }

  cancel(question) {
    this.scheduleService.cancel(question._id).subscribe((res: any) => {});
    this.scheduleService.getQuestions().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.questions = res.data;
      }
    });
  }

  myRequests() {
    this.myRequest = false;
    this.usersRequest = true;
  }
  usersRequests() {
    this.myRequest = true;
    this.usersRequest = false;
  }
}

@Component({
  selector: "ngbd-modal-content5",
  providers: [ScheduleService],
  template: `

    <div class="modal-header">
      <h4 class="modal-title">Select new Slot!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" >

    <h2>Slots:</h2>
    <label id="slott1" class="control control--radio">{{question.slots[0]}}
      <input id="slot1" type="radio" name="radio" />
      <div class="control__indicator"></div>
    </label>
    <br>
    <label id="slott2" class="control control--radio">{{question.slots[1]}}
      <input id="slot2" type="radio" name="radio"/>
      <div class="control__indicator"></div>
    </label>
    <br>
    <label id="slott3" class="control control--radio">{{question.slots[2]}}
      <input id="slot3" type="radio" name="radio" />
      <div class="control__indicator"></div>
    </label>





      </div>

    <div class="modal-footer" style="float:right;width:100%">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      <button type="button" class="btn btn-outline-dark" (click)="reschedule()">Select</button>

    </div>
  `
})
export class NgbdModalContent5 {
  question = JSON.parse(sessionStorage.getItem("queSlot"));
  selectSlot2;

  constructor(
    public activeModal: NgbActiveModal,
    private scheduleService: ScheduleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.question = JSON.parse(sessionStorage.getItem("queSlot"));
  }

  reschedule() {
    if ((<HTMLInputElement>document.getElementById("slot1")).checked) {
      this.selectSlot2 = (<HTMLInputElement>document.getElementById(
        "slott1"
      )).textContent;
    }
    if ((<HTMLInputElement>document.getElementById("slot2")).checked) {
      this.selectSlot2 = (<HTMLInputElement>document.getElementById(
        "slott2"
      )).textContent;
    }
    if ((<HTMLInputElement>document.getElementById("slot3")).checked) {
      this.selectSlot2 = (<HTMLInputElement>document.getElementById(
        "slott3"
      )).textContent;
    }
    this.scheduleService
      .sendSlot(this.question._id, this.selectSlot2)
      .subscribe((res: any) => {});
    window.location.reload();
  }
}
