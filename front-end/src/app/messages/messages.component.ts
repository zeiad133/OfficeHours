import { Component, OnInit } from "@angular/core";
import { MessagesService } from "./messages.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"],
  providers: [MessagesService]
})
export class MessagesComponent implements OnInit {
  date1: Date = new Date();
  date2: Date = new Date();
  date3: Date = new Date();
  selectSlot2: string;

  selectedslot1;
  selectedslot2;
  selectedslot3;
  sessionDetails;
  vis1 = true;
  vis2 = false;
  vis3 = true;
  vis4 = false;
  vis5;
  vis6;
  done;
  con;
  sessionRoom: string;
  message: string;
  sessionType: string;
  dates: Date[] = [];
  settings = {
    bigBanner: true,
    timePicker: true,
    format: "dd-MM-yyyy hh:mm",
    defaultOpen: false
  };
  type = JSON.parse(sessionStorage.getItem("type"));
  flag = JSON.parse(sessionStorage.getItem("flag"));
  question = JSON.parse(sessionStorage.getItem("question"));
  selectedSlot = this.question ? this.question.selectedSlot : null;
  sessionType2 = this.question ? this.question.typeOfSession : null;
  profilePic = JSON.parse(sessionStorage.getItem("profilePic"));
  constructor(
    private messagesService: MessagesService,
    private router: Router,
    private as: AuthService
  ) {
    if (!this.as.authorized) this.router.navigateByUrl("/home");
  }

  ngOnInit() {
    if (this.selectedSlot != undefined) {
      this.selectedslot2 = true;
      this.selectedslot3 = true;
      this.done = false;
      this.vis6 = false;
      this.con = true;
    } else {
      this.selectedslot1 = true;
      this.done = false;
      this.vis6 = false;
    }
    if (this.sessionType2 != undefined) {
      this.selectedslot3 = false;
      this.sessionDetails = true;
      this.con = false;
      this.done = true;
    } else {
      this.selectedslot3 = true;
      this.sessionDetails = false;
    }

    if (this.question.status == "pending") {
      this.selectedslot3 = false;
      this.sessionDetails = false;
    }
    if (
      this.question.message != undefined &&
      this.question.status == "rejected"
    ) {
      this.vis3 = false;
      this.vis4 = true;
      this.selectedslot3 = false;
      this.sessionDetails = false;
    } else {
      this.vis3 = true;
      this.vis4 = false;
    }

    if (
      this.question.message != undefined &&
      this.question.status == "accepted"
    ) {
      this.vis1 = false;
      this.vis2 = true;
      this.vis5 = true;
    }
  }
  confirm() {
    this.vis6 = true;
  }

  show() {
    if (this.flag == false) {
      var requestButton = document.getElementById("myRequest");
      var requestButton2 = document.getElementById("usersRequest");
      var requestButton3 = document.getElementById("button");

      var requestButton11 = document.getElementById("myRequest2");
      var requestButton22 = document.getElementById("usersRequest2");

      requestButton.setAttribute("style", "visibility: visible");
      requestButton2.setAttribute("style", "display: none");
      requestButton11.setAttribute("style", "visibility: visible");
      requestButton22.setAttribute("style", "display: none");
      requestButton3.setAttribute("style", "display: none");
    } else {
      var requestButton = document.getElementById("myRequest");
      var requestButton2 = document.getElementById("usersRequest");

      var requestButton11 = document.getElementById("myRequest2");
      var requestButton22 = document.getElementById("usersRequest2");

      var requestButton3 = document.getElementById("button");

      requestButton2.setAttribute("style", "visibility: visible");
      requestButton.setAttribute("style", "display: none");
      requestButton22.setAttribute("style", "visibility: visible");
      requestButton11.setAttribute("style", "display: none");

      requestButton3.setAttribute("style", "display: none");
    }
  }

  print() {
    console.log(this.dates);
  }

  acceptRequest() {
    this.messagesService
      .acceptRequest(this.question._id)
      .subscribe((res: any) => {
        // print result
      });
    this.question.status = "accepted";
    this.vis1 = true;
    this.vis2 = false;
  }

  rejectRequest() {
    this.messagesService
      .rejectRequest(this.question._id)
      .subscribe((res: any) => {
        // print result
      });
    this.question.status = "rejected";
    this.vis3 = true;
    this.vis4 = false;
  }

  sendSlots() {
    if (this.date1 != undefined) {
      this.dates.push(this.date1);
    }
    if (this.date2 != undefined) {
      this.dates.push(this.date2);
    }
    if (this.date3 != undefined) {
      this.dates.push(this.date3);
    }

    this.messagesService
      .addSlots(this.question._id, this.dates)
      .subscribe((res: any) => {
        // print result
      });

    this.messagesService
      .sendMessage(this.question._id, this.message)
      .subscribe((res: any) => {
        // print result
      });
    this.question.message = this.message;
    this.question.slots = this.dates;

    sessionStorage.setItem("accept", JSON.stringify("accept"));
    this.vis1 = false;
    this.vis2 = true;
    this.vis5 = true;
  }

  sendMessage() {
    this.messagesService
      .sendMessage(this.question._id, this.message)
      .subscribe((res: any) => {
        // print result
      });
    this.question.message = this.message;

    sessionStorage.setItem("reject", JSON.stringify("reject"));
    this.vis3 = false;
    this.vis4 = true;
  }

  finish() {
    this.sessionType = (<HTMLInputElement>document.getElementById(
      "sessionType"
    )).value;

    this.messagesService
      .addRoom(this.question._id, this.sessionRoom, this.sessionType)
      .subscribe((res: any) => {
        // print result
      });

    this.done = true;
    this.vis6 = false;
    this.con = false;
    this.question.sessionRoom = this.sessionRoom;
    this.question.typeOfSession = this.sessionType;
  }

  viewProfile(user) {
    sessionStorage.setItem("viewExpert", JSON.stringify(user));
    this.router.navigateByUrl("/view-profile");
  }

  selectSlot() {
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
    this.messagesService
      .sendSlot(this.question._id, this.selectSlot2)
      .subscribe((res: any) => {
        // print result
      });
    this.selectedslot2 = true;
    this.selectedslot1 = true;
    this.selectedslot3 = true;
    this.sessionDetails = false;

    this.question.selectedSlot = this.selectSlot2;
  }
}
