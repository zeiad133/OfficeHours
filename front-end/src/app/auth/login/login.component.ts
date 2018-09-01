import { Component, OnInit, AfterViewInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { regService } from "../../services/reg.services";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, AfterViewInit {
  private clientId: string = "113222397785-sbpmctgp9t6tac2eh0gqnl4bptphora5.apps.googleusercontent.com";
  password: string;
  email: string;
  users: LocalDataSource = new LocalDataSource();
  responseMessage;
  private scope = [
    "profile",
    "email",
    "https://www.googleapis.com/auth/plus.me",
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/admin.directory.user.readonly"
  ].join(" ");

  public auth2: any;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.authorized) this.router.navigateByUrl("/profile");
    else scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }
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
          email: profile.getEmail()
        };
        that.auth.googleLogIn(userob).subscribe((res: any) => {
          
          that.auth.setToken(res.data);
          window.sessionStorage.email = that.email;
          if (res.msg == "Welcome") {
            window.location.href = "#/experts";
          }
        });
      },
      function(error) {}
    );
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  add() {
    var userob = {
      email: this.email,
      password: this.password
    };
    this.auth.LogIn(userob).subscribe(
      (res: any) => {
        document.getElementById("modal").style.display = "block";
        this.auth.setToken(res.data);
        window.sessionStorage.email = this.email;

        if (res.msg == "Welcome") {
          this.responseMessage =
            "Logged in successfuly, you will be redirected to Home page.";
          setTimeout(() => {
            window.location.href = "#/experts";
          }, 2000);
        } else this.responseMessage = "Error";
      },
      (err: any) => {
        document.getElementById("modal").style.display = "block";
        this.responseMessage = JSON.parse(err._body).msg;
      }
    );
  }

  ngOnInit() {}
}
