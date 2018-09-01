import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  ViewChild
} from "@angular/core";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ProfileService } from "./profile.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { Ng2SmartTableModule, LocalDataSource } from "ng2-smart-table";
import { FileUploader } from "ng2-file-upload";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";

let globalUser;
let profileComponent;
@Component({
  selector: "NgbdModalContent",
  providers: [ProfileService, FormBuilder],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Edit your profile!</h4> <button type="button" class="btn btn-outline-dark" style="margin-left: 50%; background-color:rgb(201, 7, 7);color: white; border: none" (click)="deleteAccount()">Delete Account</button>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" >
    <div class="signup__container">

    <div class="container__child signup__form" style="float:left;width:350px">
      <form action="#">


        <div class="form-group" >
          <label for="firstName">First Name</label>
          <input class="form-control" type="text" [(ngModel)]="firstName" name="firstName" id="firstName"  />
        </div>
        <div class="form-group" >
          <label for="username">Username</label>
          <input class="form-control" type="text" [(ngModel)]="username" name="username" id="username" placeholder="james.bond" required />
        </div>
        <div class="form-group">
        <label for="job">Job</label>
        <input class="form-control" type="text" [(ngModel)]="job" name="job" id="job" placeholder="Founder of Startup"  />
      </div>
        <div class="form-group" >
          <label for="about">About</label>
          <input style="height:100px" class="form-control" type="text" [(ngModel)]="about" name="about" id="about"   />
        </div>

        <div class="m-t-lg">

        </div>

      </form>
    </div>

    <div class="container__child signup__form" style="float:right;width:350px">
      <form action="#">


        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input class="form-control" type="text" [(ngModel)]="lastName" name="lastName" id="lastName"  />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input class="form-control" type="text" [(ngModel)]="email" name="email" id="email" placeholder="james.bond@spectre.com" required />
        </div>
        <div class="form-group">
          <label for="privacy">Privacy</label>
          <button type="button" class="btn btn-sm btn-default" (click)= "onPrivate()">Private</button>
          <button type="button" class="btn btn-sm btn-default" (click)="onPublic()" >Public</button>
        </div>
        <div class="form-group">
          <label for="profile-pic">Profile Picture</label><br>
          <input type="file" id="Image" name="Image"class="upload"(change)="onFileChange($event)" #fileInput>
        <button type="submit" class="submit" [disabled]="!valid" (click)="onSubmit($event)">Submit <i class="fa fa-spinner fa-spin fa-fw" *ngIf="loading"></i></button>
        <button type="button" class="clear" [disabled]="!valid" (click)="clearFile()">Clear file</button>
        </div>

      </form>
    </div>
  </div>    </div>
    <div class="modal-footer" style="float:right;width:100%">
    <div style="display: flex; flex-direction: column">
      <label for="Old Password">Old Password</label>
      <input class="form-control" type="password" [(ngModel)]="oldpassword" name="oldpassword" id="oldpassword" placeholder=""  />
</div>
<div style="display: flex; flex-direction: column;">
      <label for="New Password">New Password</label>
      <input class="form-control" type="password" [(ngModel)]="newpassword" name="newpassword" id="newpassword" placeholder=""  />
</div>
<div style="display: flex; flex-direction: column">
      <label for="Confirm New Password">Confirm New Password</label>
      <input class="form-control" type="password" [(ngModel)]="confirmnewpassword" name="confirmnewpassword" id="confirmnewpassword" placeholder=""  />
</div>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      <button type="button" class="btn btn-outline-dark" (click)="editProfile()">Edit</button>

    </div>
  `
})
export class NgbdModalContent {
  username: string;
  valid: boolean = false;
  firstName: string;
  email: string;
  lastName: string;
  job: string;
  about: string;
  oldpassword: string;
  newpassword: string;
  confirmnewpassword: string;
  form: FormGroup;
  loading: boolean = false;
  Image: File;
  avatar;
  id;

  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    private router: Router,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private as: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.id = res.data._id;
        this.username = res.data.username;
        this.firstName = res.data.firstName;
        this.email = res.data.email;
        this.lastName = res.data.lastName;
        this.avatar = res.data.profilePic;
      }
    });
  }

  async editProfile() {
    if (this.oldpassword && this.newpassword && this.confirmnewpassword) {
      await this.profileService
        .updateUserPassword(
          this.email,
          this.oldpassword,
          this.newpassword,
          this.confirmnewpassword
        )
        .subscribe((res: any) => {
          alert(res.msg);
        });
    }
    this.profileService
      .editProfile(
        this.firstName,
        this.lastName,
        this.username,
        this.email,
        this.job,
        this.about
      )
      .subscribe((res: any) => {
        profileComponent.onComponentRefresh(res.data);
        this.activeModal.close();
      });
  }
  deleteAccount() {
    this.profileService.deleteUser(this.id).subscribe(async (res: any) => {
      await this.activeModal.close();
      await this.as.logout();
      alert(res.msg);
      window.location.href = "#/home";
    });
  }
  @ViewChild("fileInput") fileInput: ElementRef;

  createForm() {
    this.form = this.fb.group({
      file: null,
      mainFile: null
    });
  }

  onPrivate() {
    this.profileService.updatePrivacy("private").subscribe();
  }
  onPublic() {
    this.profileService.updatePrivacy("public").subscribe();
  }
  onFileChange(event) {
    //Method to set the value of the file to the selected file by the user
    this.Image = event.target.files[0]; //To get the image selected by the user
    this.valid = true;
  }

  onSubmit(event) {
    //Method to send the request to the server
    var image = new FormData(); //FormData creation
    image.append("Image", this.Image); //Adding the image to the form data to be sent
    this.profileService //Sending the rquest from the service function
      .setAvatar(image)
      .subscribe((res: any) => {
        console.log(res);
      });

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  clearFile() {
    // Method to clear the selected file
    this.valid = false;
    this.fileInput.nativeElement.value = "";
  }
}

@Component({
  selector: "ngbd-modal-content2",
  providers: [ProfileService],
  template: `

    <div class="modal-header">
      <h4 class="modal-title">Edit your Contact!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" >
    <div class="signup__container">

    <div class="container__child signup__form" style="float:left;width:350px">
      <form action="#">



        <div class="form-group" >
          <label for="phoneNumber">Phone Number</label>
          <input class="form-control" type="text" [(ngModel)]="phoneNumber" name="phoneNumber" id="phoneNumber"  placeholder="0123456789"  />
        </div>
        <div class="form-group">
        <label for="address">Address</label>
        <input class="form-control" type="text" [(ngModel)]="address" name="address" id="address"  />
      </div>


      </form>
    </div>


  </div>    </div>

    <div class="modal-footer" style="float:right;width:100%">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      <button type="button" class="btn btn-outline-dark" (click)="editProfile()">Edit</button>

    </div>
  `
})
export class NgbdModalContent2 {
  username: string;
  phoneNumber: Number;
  address: string;
  job: string;
  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.username = res.data.username;
      }
    });
  }

  editProfile() {
    this.profileService
      .editContact(this.username, this.phoneNumber, this.address)
      .subscribe((res: any) => {
        this.profileService.getProfile().subscribe((res: any) => {
          if (res.hasOwnProperty("data")) {
            this.username = res.data.username;
            this.phoneNumber = res.data.phoneNumber;
            this.address = res.data.address;
            profileComponent.onComponentRefresh(res.data);
          }
        });
        this.activeModal.close();
      });
  }
}

@Component({
  selector: "ngbd-modal-content6",
  providers: [ProfileService],
  template: `

    <div class="modal-header">
      <h4 class="modal-title">Add a Topic!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" >
    <div class="signup__container">

    <div class="container__child signup__form" style="float:left;width:350px">
      <form action="#">



        <div class="form-group" >
          <label for="topicTitle">Title</label>
          <input class="form-control" type="text" [(ngModel)]="topicTitle" name="topicTitle" id="topicTitle"  placeholder="Topic Title"  />
        </div>
        <div class="form-group">
        <label for="topicDescription">Description</label>
        <textarea class="form-control" type="text" [(ngModel)]="topicDescription" name="topicDescription" id="topicDescription" ></textarea>
      </div>


      </form>
    </div>


  </div>    </div>

    <div class="modal-footer" style="float:right;width:100%">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      <button type="button" class="btn btn-outline-dark" (click)="createTopic()">Create</button>

    </div>
  `
})
export class NgbdModalContent6 {
  username: string;
  topicDescription: string;
  topicTitle: string;
  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {}

  createTopic() {
    // if an empty string was entered as topicTitle or topicDescription, ignore it
    if (this.topicDescription === "" || this.topicTitle === "") return;
    // call the backend to create the new Topic
    this.profileService
      .CreateTopic(this.topicTitle, this.topicDescription)
      .subscribe((res1: any) => {
        this.profileService.getProfile().subscribe((res: any) => {
          if (res.hasOwnProperty("data")) {
            profileComponent.onComponentRefresh(res.data);
            this.activeModal.close();
          }
        });
        // this.messageOfTopic = "Created successfully!";
      });
  }
}

@Component({
  selector: "ngbd-modal-content3",
  providers: [ProfileService],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Apply for an Expert!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" >
    <div class="signup__container">

    <div class="container__child signup__form" style="float:left;width:350px">
      <form action="#">



       <div class="form-group" >
          <label for="reason">Why do you want to be an expert?</label>
          <textarea style="height:120px" class="form-control" type="text" [(ngModel)]="reason" name="reason" id="reason"></textarea>
        </div>




      </form>
    </div>


  </div>    </div>

    <div class="modal-footer" style="float:right;width:100%">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      <button type="button" class="btn btn-outline-dark" (click)="applyForExpert()">Apply</button>

    </div>
  `
})
export class NgbdModalContent3 {
  username: string;
  reason: string;
  topic: string;

  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.username == res.data.username;
      }
    });
  }

  applyForExpert() {
    this.profileService.applyForExpert(this.reason).subscribe((res: any) => {
      this.activeModal.close();
      sessionStorage.setItem("responseMessage", res.msg);
      // document.getElementById("modal").style.display = "block";
      this.profileService.getProfile().subscribe((res: any) => {
        if (res.hasOwnProperty("data")) {
          profileComponent.onComponentRefresh(res.data);
        }
      });
    });
  }
  close() {
    this.activeModal.close();
  }
}

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  providers: [ProfileService]
})
export class ProfileComponent {
  blockedname: string;
  adminArray = [
    {
      settings: {
        delete: {
          confirmDelete: true
        },
        actions: {
          add: false,
          edit: false
        },
        columns: {
          username: {
            title: "User's Username"
          },
          reason: {
            title: "reason"
          },
          rating: {
            title: "User's Rating"
          },
          status: {
            title: "Status"
          }
        }
      },
      data: []
    },
    {
      settings: {
        delete: {
          confirmDelete: true
        },
        actions: {
          add: false,
          edit: false
        },
        columns: {
          username: {
            title: " Username"
          },
          email: {
            title: "Email"
          },

          firstName: {
            title: "First Name"
          },
          lastName: {
            title: "Last Name"
          },
          job: {
            title: "Job"
          },
          phoneNumber: {
            title: "Phone Number"
          },
          address: {
            title: "Address"
          },
          avgRating: {
            title: "Average Rating"
          },
          type: {
            title: "Type"
          },
          privacy: {
            title: "Privacy"
          }
        }
      },
      data: []
    },
    {
      settings: {
        delete: {
          confirmDelete: true
        },
        actions: {
          add: false,
          edit: false
        },
        columns: {
          username: { title: "Expert's Username" },
          topics: {
            title: "Topics",
            valuePrepareFunction: data => {
              return JSON.stringify(
                data.map(topic => {
                  return topic.topicTitle;
                })
              );
            },
            noDataMessage: "No existing topics"
          }
        }
      },
      data: []
    },

    {
      settings: {
        actions: {
          delete: false,
          add: false,
          edit: false
        },
        columns: {
          questionSubject: {
            title: "Subject"
          },
          user: {
            title: "User's username",
            valuePrepareFunction: data => {
              return data.username;
            },
            noDataMessage: "No existing users"
          },

          expert: {
            title: "Expert",
            valuePrepareFunction: data => {
              return data.username;
            },
            noDataMessage: "No existing expert"
          },
          status: {
            title: "Status"
          },
          questionContent: {
            title: "Message sent"
          },
          time: {
            title: "Session Time"
          },
          selectedSlot: {
            title: "Selected Slot"
          },
          sessionRoom: {
            title: "Session Room"
          },
          typeOfSession: {
            title: "Method of communication"
          }
        }
      },
      data: []
    },
    {
      settings: {
        delete: {
          confirmDelete: true
        },
        actions: {
          add: false,
          edit: false
        },
        columns: {
          reviewer: {
            title: "Reviewer's Username"
          },
          reviewerType: {
            title: "Reviewer Type"
          },
          reviewee: {
            title: "Revieww Username"
          },
          revieweeType: {
            title: "Reviewee Type"
          },
          room: {
            title: "Room"
          },
          feedback: {
            title: "Feedback"
          }
        }
      },
      data: []
    }
  ];
  adminCurrentData = [];
  adminCurrentSettings = {};
  adminUserSelected = { _id: "" };
  adminUserDisplay = "";
  adminPanel = "";
  adminTableTitle = "";
  adminIndexTable = 0;
  showAcceptButtonAdmin = false;
  adminAddUsername = "";
  logAdmin = "";
  showAddAdminbutton = false;
  dataRefresher: any;
  job: string;
  Details: string;
  CompanyName: string;
  Date: string;
  note: string;
  noteTitle: string;
  type: string;
  NoteId: Object;
  ExpId: Object;
  privacy: string;
  experiences = [];
  user = [];
  visible = true;
  notes = [];
  typingTimer = null;
  doneTypingInterval = 10;
  finaldoneTypingInterval = 2000;
  source: LocalDataSource;
  today = new Date();
  isAdmin = false;
  isExpert = false;
  topic = false;
  topics = [];
  m = this.checkTime(this.today.getMonth());
  d = this.checkTime(this.today.getDate());

  constructor(
    private as: AuthService,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private router: Router
  ) {
    profileComponent = this;
    if (this.as.authorized) this.getData();
    else this.router.navigateByUrl("/home");
  }

  ngOnInit() {
    sessionStorage.setItem("adminProfilePanel", "users");
    this.profileService.getProfile().subscribe((res: any) => {
      if (res.data.type === "expert") {
        this.profileService
          .getExpertByUsername(res.data.username)
          .subscribe((res: any) => {
            this.topics = res.data.topics;
          });
      }
      if (res.hasOwnProperty("data")) {
        globalUser = res.data;
        this.user = res.data;
        console.log("User Profile Picture", res.data.profilePic);
        this.type = res.data.type;
        if (res.data.type == "expert") {
          this.visible = false;
          this.topic = true;
        }
      }
    });
    this.profileService.getExperiences().subscribe((res: any) => {
      this.experiences = res.data;
    });
    this.viewNotes();
  }
  block() {
    this.router.navigateByUrl("/blockedusers");
  }

  blockuser() {
    this.profileService.BlockUser(this.blockedname).subscribe(
      (res: any) => {
        //console.log(res.data)
        alert(this.blockedname + " was blocked successfully");
        this.router.navigateByUrl("/blockedusers");
      },
      error => {
        window.alert(error.error.msg);
      }
    );
  }
  onComponentRefresh(newUser) {
    this.user = newUser;
    if (newUser.type === "expert") {
      this.profileService
        .getExpertByUsername(newUser.username)
        .subscribe((res: any) => {
          this.topics = res.data.topics;
        });
    }
  }
  viewProfile() {
    sessionStorage.setItem(
      "viewExpert",
      JSON.stringify(this.adminUserSelected)
    );
    this.router.navigateByUrl("/view-profile");
  }
  ngDoCheck() {
    const string = sessionStorage.getItem("adminProfilePanel");

    switch (string) {
      case "applications":
        this.adminIndexTable = 0;
        this.adminTableTitle = "Applications Table: ";
        this.showAcceptButtonAdmin = true;
        this.showAddAdminbutton = false;
        break;
      case "users":
        this.adminIndexTable = 1;
        this.adminTableTitle = "Users Table: ";
        this.showAcceptButtonAdmin = false;
        this.showAddAdminbutton = true;
        break;
      case "experts":
        this.adminIndexTable = 2;
        this.adminTableTitle = "Experts Table: ";
        this.showAcceptButtonAdmin = false;
        this.showAddAdminbutton = false;
        break;
      case "sessions":
        this.adminIndexTable = 3;
        this.adminTableTitle = "Reserved Sessions Table: ";
        this.showAcceptButtonAdmin = false;
        this.showAddAdminbutton = false;
        break;
      case "feedbacks":
        this.adminIndexTable = 4;
        this.adminTableTitle = "Submitted Feedbacks Table: ";
        this.showAcceptButtonAdmin = false;
        this.showAddAdminbutton = false;
        break;
    }
    this.adminCurrentSettings = this.adminArray[this.adminIndexTable].settings;
    this.adminCurrentData = this.adminArray[this.adminIndexTable].data;
  }

  onUserRowSelect(event): void {
    if (this.showAcceptButtonAdmin) {
      this.adminUserSelected = event.data;
      this.adminUserDisplay = event.data.username;
    } else if (this.showAddAdminbutton) {
      this.adminUserSelected = event.data;
      this.adminAddUsername = event.data.username;
    }
    if (this.adminIndexTable == 1) {
    }
  }

  onEditCall(event) {
    event.confirm.resolve(event.newData);
    this.profileService.updateUser(event.newData).subscribe(
      (res: any) => {
        if (res.status == 203)
          this.logAdmin =
            "User '" + event.data.username + "' updated successfully.";
        else this.logAdmin = res.msg;
      },
      (err: any) => {
        this.logAdmin = err.error.msg;
      }
    );
  }
  onDeleteCall(event) {
    if (this.adminIndexTable == 0)
      this.profileService.deleteApplication(event.data._id).subscribe(
        (res: any) => {
          if (res.ok)
            this.logAdmin =
              "Application for '" +
              event.data.username +
              "' deleted successfully.";
          else this.logAdmin = res.msg;
          this.profileService.getApplications().subscribe((res: any) => {
            this.adminArray[0].data = res.data;
          });
        },
        (err: any) => {
          this.logAdmin = err.error.msg;
        }
      );
    else if (this.adminIndexTable == 1)
      this.profileService.deleteUser(event.data._id).subscribe(
        (res: any) => {
          if (res.ok)
            this.logAdmin =
              "User '" + event.data.username + "' deleted successfully.";
          else this.logAdmin = res.msg;
          this.profileService.getUsers().subscribe((res: any) => {
            this.adminArray[1].data = res.data;
          });
          this.profileService.getExperts().subscribe((res: any) => {
            this.adminArray[2].data = res.data;
          });
        },
        (err: any) => {
          this.logAdmin = err.error.msg;
        }
      );
    else if (this.adminIndexTable == 2)
      this.profileService.deleteExpert(event.data.username).subscribe(
        (res: any) => {
          if (res.ok)
            this.logAdmin =
              "Expert '" + event.data.username + "' deleted successfully.";
          else this.logAdmin = res.msg;
          this.profileService.getExperts().subscribe((res: any) => {
            this.adminArray[2].data = res.data;
          });
        },
        (err: any) => {
          this.logAdmin = err.error.msg;
        }
      );
    else if (this.adminIndexTable == 4)
      this.profileService.deleteFeedback(event.data._id).subscribe(
        (res: any) => {
          if (res.ok)
            this.logAdmin =
              "Feedback of '" +
              event.data.reviewer +
              "' to '" +
              event.data.reviewee +
              "' deleted successfully.";
          else this.logAdmin = res.msg;
          this.profileService.getFeedbacks().subscribe((res: any) => {
            this.adminArray[4].data = res.data;
          });
        },
        (err: any) => {
          this.logAdmin = err.error.msg;
        }
      );
  }
  adminAcceptExpert() {
    this.profileService.acceptExpert(this.adminUserSelected._id).subscribe(
      (res: any) => {
        if (res.ok)
          this.logAdmin =
            "User '" +
            res.data.username +
            "'s application accepted successfully.";
        else this.logAdmin = res.msg;
        this.profileService.getApplications().subscribe((res: any) => {
          this.adminArray[0].data = res.data;
        });
        this.profileService.getUsers().subscribe((res: any) => {
          this.adminArray[1].data = res.data;
        });
        this.profileService.getExperts().subscribe((res: any) => {
          this.adminArray[2].data = res.data;
        });
      },
      (err: any) => {
        this.logAdmin = err.error.msg;
      }
    );
  }
  AdminAddAdmin() {
    if (this.adminAddUsername === "") return;
    this.profileService
      .AddAdmin(this.adminAddUsername)
      .subscribe((res: any) => {
        this.profileService.getUsers().subscribe((res: any) => {
          this.adminArray[1].data = res.data;
        });
        if (res.ok)
          this.logAdmin = this.adminAddUsername + " is added as an admin.";
        else this.logAdmin = res.msg;
        this.adminAddUsername = "";
      });
  }

  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  addNoteHTML() {
    this.notes.push({ noteTitle: "Title", note: "Body" });
    setTimeout(function() {
      var notesDiv = document.getElementById("notesDiv");
      notesDiv.scrollTo({
        left: notesDiv.scrollWidth,
        top: 0,
        behavior: "smooth"
      });
    }, 10);
  }

  addExperienceHTML() {
    this.experiences.push({
      job: "Job Title",
      date: new Date().toString(),
      details: "Details goes here",
      companyName: "GitForce"
    });
    setTimeout(function() {
      var experiencesDiv = document.getElementById("experiencesDiv");
      experiencesDiv.scrollTo({
        left: 0,
        top: experiencesDiv.scrollHeight,
        behavior: "smooth"
      });
    }, 10);
  }
  removeNote(note) {
    var index = this.notes.indexOf(note, 0);
    if (index > -1) {
      this.notes.splice(index, 1);
    }
  }
  editProfile() {
    const modalRef = this.modalService.open(NgbdModalContent, { size: "lg" });
  }
  applyForExpert() {
    const modalRef = this.modalService.open(NgbdModalContent3);
  }

  addTopic() {
    const modalRef = this.modalService.open(NgbdModalContent6);
  }

  createExperience() {
    this.profileService
      .createExperience(this.job, this.Date, this.Details, this.CompanyName)
      .subscribe((res: any) => {});
  }
  viewNotes() {
    this.profileService.viewNotes().subscribe((res: any) => {
      this.notes = res.data;
    });
  }
  createNote() {
    this.profileService
      .createNotes(this.note, this.noteTitle)
      .subscribe((res: any) => {});
  }
  updateNotes() {
    this.profileService.updateNotes(this.notes).subscribe((res: any) => {
      document.getElementById("notesPart").classList.add("saved");
      setTimeout(function() {
        document.getElementById("notesPart").classList.remove("saved");
      }, 2000);
    });
  }
  removeExperience(experience) {
    var index = this.experiences.indexOf(experience, 0);
    if (index > -1) {
      this.experiences.splice(index, 1);
    }
  }
  updateExperiences() {
    this.profileService
      .updateExperiences(this.experiences)
      .subscribe((res: any) => {
        document.getElementById("experiencesPart").classList.add("saved");
        setTimeout(function() {
          document.getElementById("experiencesPart").classList.remove("saved");
        }, 2000);
      });
  }
  updateExperience() {
    this.profileService
      .updateExperience(
        this.job,
        this.Date,
        this.Details,
        this.CompanyName,
        this.ExpId
      )
      .subscribe((res: any) => {});
  }
  deleteNote() {
    this.profileService.deleteNotes(this.NoteId).subscribe((res: any) => {});
  }
  deleteExperience() {
    this.profileService
      .deleteExperience(this.ExpId)
      .subscribe((res: any) => {});
  }
  updatePrivacy() {
    this.profileService.updatePrivacy(this.privacy).subscribe((res: any) => {});
  }

  contact() {
    const modalRef = this.modalService.open(NgbdModalContent2);
  }

  getData() {
    this.profileService.getProfile().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.user = res.data;
        if (res.data.type == "admin") {
          this.isAdmin = true;
          this.profileService.getApplications().subscribe((res: any) => {
            this.adminArray[0].data = res.data;
          });
          this.profileService.getUsers().subscribe((res: any) => {
            this.adminArray[1].data = res.data;
          });
          this.profileService.getExperts().subscribe((res: any) => {
            this.adminArray[2].data = res.data;
          });
          this.profileService.getQuestions().subscribe((res: any) => {
            this.adminArray[3].data = res.data;
          });
          this.profileService.getFeedbacks().subscribe((res: any) => {
            this.adminArray[4].data = res.data;
          });
        } else {
          this.isAdmin = false;
          if (res.data.type == "expert") {
            this.visible = false;
            this.isExpert = true;
          }
        }
      }
    });
  }
}
