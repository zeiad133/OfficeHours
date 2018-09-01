import { Component, OnInit } from "@angular/core";
import { InboxService } from "./inbox.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-inbox",
  templateUrl: "./inbox.component.html",
  styleUrls: ["./inbox.component.scss"],
  providers: [InboxService]
})
export class InboxComponent implements OnInit {
  questions = [];
  requests = [];
  username: string;
  id: object;
  type = JSON.parse(sessionStorage.getItem("type"));
  flag = false;

  constructor(
    private inboxService: InboxService,
    private router: Router,
    private as: AuthService
  ) {
    if (!this.as.authorized) this.router.navigateByUrl("/home");
  }

  ngOnInit() {
    this.inboxService.getQuestionsUsers().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.requests = res.data;
      }
    });

    this.inboxService.getQuestions().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.questions = res.data;
      }
    });

    this.flag = false;
    sessionStorage.setItem("flag", JSON.stringify(this.flag));
  }

  selectQuestion(question): void {
    sessionStorage.setItem("question", JSON.stringify(question));
    this.flag = false;
    sessionStorage.setItem("flag", JSON.stringify(this.flag));
  }

  selectRequest(request): void {
    sessionStorage.setItem("question", JSON.stringify(request));
    this.flag = true;
    sessionStorage.setItem("flag", JSON.stringify(this.flag));
  }

  usersRequests() {
    var requestButton = document.getElementById("myRequest");
    var requestButton2 = document.getElementById("usersRequest");

    requestButton2.setAttribute("style", "visibility: visible");
    requestButton.setAttribute("style", "display: none");
    this.flag = true;
    sessionStorage.setItem("flag", JSON.stringify(this.flag));

    this.inboxService.getQuestionsUsers().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.requests = res.data;
      }
    });
  }

  myRequests() {
    var requestButton = document.getElementById("myRequest");
    var requestButton2 = document.getElementById("usersRequest");

    requestButton
      ? requestButton.setAttribute("style", "visibility: visible")
      : null;
    requestButton2
      ? requestButton2.setAttribute("style", "display: none")
      : null;

    this.flag = false;
    sessionStorage.setItem("flag", JSON.stringify(this.flag));
    this.inboxService.getQuestions().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.questions = res.data;
      }
    });
  }
}
