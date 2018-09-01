import { Component, OnInit, AfterViewInit } from "@angular/core";
import { GoogleSignInSuccess } from "angular-google-signin";
import { GoogleSignInComponent } from "angular-google-signin";
import { regService } from "../../services/reg.services";
import { UserOb } from "../../objects/UserObject";
import { LocalDataSource } from "ng2-smart-table";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit, AfterViewInit {
  private clientId: string = "113222397785-sbpmctgp9t6tac2eh0gqnl4bptphora5.apps.googleusercontent.com";
  private scope = [
    "profile",
    "email",
    "https://www.googleapis.com/auth/plus.me",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/admin.directory.user.readonly"
  ].join(" ");
  public auth2: any;
  public googleInit() {
    let that = this;
    gapi.load("auth2", function() {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        scope: that.scope
      });
      that.attachSignin(document.getElementById("googleBtn"));
    });
  }

  public attachSignin(element) {
    let that = this;
    this.auth2.attachClickHandler(
      element,
      {},
      function(googleUser) {
        let profile = googleUser.getBasicProfile();

        var userob = {
          username: profile
            .getEmail()
            .substring(0, profile.getEmail().indexOf("@")),
          email: profile.getEmail()
        };
        that.regService.googleReg(userob).subscribe((res: any) => {
          alert(res.msg);
          that.users.add(userob);
        });
      },
      function(error) {}
    );
  }

  ngAfterViewInit() {
    this.googleInit();
    // this.htmlToAdd = '<div class="w3-modal-content w3-card-4"><header class="w3-container w3-teal" ><span onclick="document.getElementById('id01').style.display='none'" class="w3-button w3-display-topright" >& times; </span>< h2 > Header < /h2>< /header>< div class="w3-container" ><p>Some text.Some text.Some text.< /p>< p > Some text.Some text.Some text.< /p>< /div>< footer class="w3-container w3-teal" ><p>Footer < /p>< /footer>< /div>';
  }

  username: string;
  password: string;
  email: string;
  confirmPassword: string;
  users: LocalDataSource = new LocalDataSource();
  responseMessage: string;
  constructor(
    private regService: regService,
    private as: AuthService,
    private router: Router
  ) {
    if (this.as.authorized) {
      this.router.navigateByUrl("/profile");
    } else scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }
  private myClientId: string = "113222397785-sbpmctgp9t6tac2eh0gqnl4bptphora5.apps.googleusercontent.com";

  add() {
    var userob = {
      username: this.username,
      confirmPassword: this.confirmPassword,
      email: this.email,
      password: this.password
    };
    this.regService.addReg(userob).subscribe(
      (res: any) => {
        document.getElementById("modal").style.display = "block";
        if (res.ok) this.responseMessage = res.json().msg;
        else this.responseMessage = "Error";
        this.users.add(userob);
        setTimeout(() => {
          window.location.href = "#/auth/signin";
        }, 2000);
      },
      (err: any) => {
        document.getElementById("modal").style.display = "block";
        this.responseMessage = JSON.parse(err._body).msg;
      }
    );
  }

  ngOnInit() {}
}
