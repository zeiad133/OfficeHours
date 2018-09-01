import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ProfileService } from "../profile/profile.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ExpertsService } from "./experts.service";

@Component({
  selector: "app-experts",
  templateUrl: "./experts.component.html",
  styleUrls: ["./experts.component.scss"],
  providers: [ExpertsService]
})
export class ExpertsComponent implements OnInit {
  sort;
  f1;
  f2;
  experts = [];
  responseMessage: string;
  public chosenExperts = [];
  message = "";
  constructor(
    private expertsService: ExpertsService,
    private modalService: NgbModal,
    private router: Router,
    private as: AuthService
  ) {
    if (!this.as.authorized) this.router.navigateByUrl("/home");
  }

  myfilter(topic, ratings) {
    var radios = document.getElementsByName("ratings");
    var x = 0;
    var ascend = 1;
    var descend = -1;
    // sorting experts  depending on username only in ascending way
    for (var i = 0, length = radios.length; i < length; i++) {
      if ((<HTMLInputElement>radios[i]).checked) {
        x = 1;
        // sorting experts based on username in ascending order
        if ((<HTMLInputElement>radios[i]).value == "asc") {
          this.expertsService
            .sortExpertsUsername(ascend)
            .subscribe((res: any) => {
              if (res.hasOwnProperty("data")) {
                this.experts = res.data;
                for (var i = 0; i < this.experts.length; i++) {
                  this.experts[i].view_id = i;
                  this.experts[i].selected = false;
                }
              }
            });
        }

        // sorting experts  depending on username only in descending way
        if ((<HTMLInputElement>radios[i]).value == "desc") {
          this.expertsService
            .sortExpertsUsername(descend)
            .subscribe((res: any) => {
              if (res.hasOwnProperty("data")) {
                this.experts = res.data;
                for (var i = 0; i < this.experts.length; i++) {
                  this.experts[i].view_id = i;
                  this.experts[i].selected = false;
                }
              }
            });

          //  sorting experts  depending on avgRating only in ascending way
        }

        if ((<HTMLInputElement>radios[i]).value == "ascR") {
          this.expertsService.sortExpertsRating(ascend).subscribe((res: any) => {
            if (res.hasOwnProperty("data")) {
              this.experts = res.data;
              for (var i = 0; i < this.experts.length; i++) {
                this.experts[i].view_id = i;
                this.experts[i].selected = false;
              }
            }
          });
        }

        //  sorting experts  depending on avgRating only in descending way
          if ((<HTMLInputElement>radios[i]).value == "descR") {
              this.expertsService.sortExpertsRating(descend).subscribe((res: any) => {
                  if (res.hasOwnProperty("data")) {
                      this.experts = res.data;
                      for (var i = 0; i < this.experts.length; i++) {
                          this.experts[i].view_id = i;
                          this.experts[i].selected = false;
                      }
                  }
              });
          }
        break;
      }
    }
    // only getting experts if user did not choose
    if (x == 0) {
      this.expertsService.getExperts().subscribe((res: any) => {
        if (res.hasOwnProperty("data")) {
          this.experts = res.data;
          for (var i = 0; i < this.experts.length; i++) {
            this.experts[i].view_id = i;
            this.experts[i].selected = false;
          }
        }
      });
    }

    // soritng with topic ANd username
  }
  onClick() {
    var contactDiv = document.getElementById("experts");
    scrollTo({ left: 0, top: contactDiv.offsetTop, behavior: "smooth" });
  }

  open() {
    this.f1=true;
    this.f2=false;
    this.sort=false;
  }

  close() {
    this.f1=false;
    this.f2=true;
    this.sort=true;
  }
  ngOnInit() {
    this.f1=false;
    this.f2=true;
    this.sort=true;

    if (sessionStorage.getItem("searchInput") == '""') {
      this.expertsService.getExperts().subscribe((res: any) => {
        if (res.hasOwnProperty("data")) {
          this.experts = res.data;
          for (var i = 0; i < this.experts.length; i++) {
            this.experts[i].view_id = i;
            this.experts[i].selected = false;
          }
        }
      });
    } else if (sessionStorage.getItem("searchDropBox") == '"username"') {
      this.expertsService
        .getExpertByUsername(JSON.parse(sessionStorage.getItem("searchInput")))
        .subscribe((res: any) => {
          if (res.hasOwnProperty("data")) {
            this.experts = res.data;
            for (var i = 0; i < this.experts.length; i++) {
              this.experts[i].view_id = i;
              this.experts[i].selected = false;
            }
            sessionStorage.setItem("searchInput", '""');
            console.log("Successfully retrieved getExpertByUsername.");
          }
        });
    } else if (sessionStorage.getItem("searchDropBox") == '"topic"') {
      this.expertsService
        .getExpertsByTopic(JSON.parse(sessionStorage.getItem("searchInput")))
        .subscribe((res: any) => {
          if (res.hasOwnProperty("data")) {
            this.experts = res.data;
            for (var i = 0; i < this.experts.length; i++) {
              this.experts[i].view_id = i;
              this.experts[i].selected = false;
            }
            sessionStorage.setItem("searchInput", '""');
            console.log("Successfully retrieved getExpertByTopic.");
          }
        });
    }
  }

  // ngDoCheck() {
  //   this.responseMessage = sessionStorage.getItem("responseMessage");
  // }

  getProfile(expert) {
    sessionStorage.setItem("viewExpert", JSON.stringify(expert));
    this.router.navigateByUrl("/view-profile");
  }
  addFav(username) {
    
    this.expertsService.addFavourite(username).subscribe(
      (res: any) => {
        document.getElementById("modal").style.display = "block";
        
        this.responseMessage =username + " was added to your favourite list";
      },
      error => {
        document.getElementById("modal").style.display = "block";
        this.responseMessage = JSON.parse(error._body).msg;
      }
    );
  }

  sendRequest() {
    this.expertsService.saveExperts(this.chosenExperts);
    const modalRef = this.modalService.open(NgbdModalContent4);
  }
  /*
*This method is used to select experts and unselect them to send them my question
*/
  toggleExpert(expert) {
    if (!this.chosenExperts.includes(expert))
      if (this.chosenExperts.length < 3) {
        expert.selected = true;
        expert.activity = "active";
        this.chosenExperts.push(expert);
        var expertView = document.getElementById("expertView" + expert.view_id);
        expertView.setAttribute("checked", "true");
        sessionStorage.setItem(
          "chosenExperts",
          JSON.stringify(this.chosenExperts)
        );
      } else {
        expert.selected = false;
        expert.activity = "inactive";
        this.chosenExperts.forEach((item, index) => {
          if (item === expert) this.chosenExperts.splice(index, 1);
        });
        var expertView = document.getElementById("expertView" + expert.view_id);
        expertView.removeAttribute("checked");
        this.message = "You can only choose three experts to address.";
        document.getElementById("modal").style.display = "block";
      }
    else {
      expert.selected = false;
      this.chosenExperts.forEach((item, index) => {
        if (item.id == expert.id) this.chosenExperts.splice(index, 1);
      });
      var expertView = document.getElementById("expertView" + expert.view_id);
      expertView.removeAttribute("checked");
    }
    var requestButton = document.getElementById("requester");
    if (this.chosenExperts.length > 0) {
      requestButton.setAttribute("style", "visibility: visible");
    } else {
      requestButton.setAttribute("style", "visibility: hidden");
    }
  }
}

@Component({
  selector: "ngbd-modal-content4",
  providers: [ExpertsService, ProfileService, ExpertsComponent],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Request a Session</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" >
    <div class="signup__container">

    <div class="container__child signup__form" style="float:left;width:350px">
      <form action="#">


      <div class="form-group" >
      <label for="questionSubject">Title</label>
      <input class="form-control" type="questionSubject" [(ngModel)]="questionSubject" name="questionSubject" id="questionSubject"  />

    </div>
       <div class="form-group" >
          <label for="questionContent">Question !?</label>
          <input style="height:120px" class="form-control" type="questionContent" [(ngModel)]="questionContent" name="questionContent" id="questionContent"   />
        </div>




      </form>
    </div>


  </div>    </div>
    <div class="modal-footer" style="float:right;width:100%">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      <button type="button" class="btn btn-outline-dark" (click)="sendRequest()">Apply</button>

    </div>
  `
})
export class NgbdModalContent4 {
  questionContent: string;

  questionSubject: string;
  user = [];
  chosenExperts: any;
  experts = [];
  responseMessage: string;
  constructor(
    public activeModal: NgbActiveModal,
    public expertsComponent: ExpertsComponent,
    private profileService: ProfileService,
    private expertService: ExpertsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.user = res.data;
      }
    });
    this.chosenExperts = JSON.parse(sessionStorage.getItem("chosenExperts"));
  }

  sendRequest() {
    for (var i = 0; i < this.chosenExperts.length; i++) {
      this.expertService
        .sendRequest(
          this.questionSubject,
          this.questionContent,
          this.user,
          this.chosenExperts[i]
        )
        .subscribe((res: any) => {
          console.log("Response:", res);
          if (res.data != null) {
            this.questionContent = "";
            this.questionSubject = "";
          }
          // sessionStorage.setItem("responseMessage", res.msg);
          // document.getElementById("modal").style.display = "block";
        });
    }
    this.activeModal.close();

    for (var i = 0; i < this.chosenExperts.length; i++) {
      this.chosenExperts[i].username;
    }
  }
}
