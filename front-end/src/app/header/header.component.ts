import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { HeaderService } from "./header.service";
import { Router } from "@angular/router";

@Component({
  selector: "headerr",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
  providers: [HeaderService]
})
export class HeaderComponent {
  notifications: number;
  user = [];
  search: String;
  searchDropBox: String;
  filterAdminHTML = false;
  type: string;

  constructor(
    private as: AuthService,
    private headerService: HeaderService,
    private router: Router
  ) {
    if (this.as.authorized)
      this.headerService.getProfile().subscribe((res: any) => {
        sessionStorage.setItem("searchInput", '""');
        sessionStorage.setItem("favInput", '""');
        //console.log(res.data)
        if (res.hasOwnProperty("data")) {
          this.user = res.data;
          sessionStorage.setItem("userr", JSON.stringify(res.data));
          sessionStorage.setItem("username", JSON.stringify(res.data.username));
          this.filterAdminHTML = res.data.type == "admin";
          sessionStorage.setItem(
            "profilePic",
            JSON.stringify(res.data.profilePic)
          );

          sessionStorage.setItem("type", JSON.stringify(res.data.type));
          this.type = res.data.type;
        }
        if (res.data.type == "admin") {
          var header = document.getElementById("myNavbar");
          header.classList.add("w3-light-grey");
        }
      });
  }

  logout() {
    this.as.logout();
    this.router.navigateByUrl("/home");
  }

  add() {
    if (this.notifications == undefined) {
      this.notifications = 0;
    } else {
      this.notifications++;
      var span = document.getElementById("counter");
      span.setAttribute("style", "visibility: visible;");
    }
  }
  reviewAll() {
    this.notifications = 0;
    var span = document.getElementById("counter");
    span.setAttribute("style", "visibility: hidden;");
  }

  toggleAdminPanel(panel) {
    sessionStorage.setItem("adminProfilePanel", panel);
  }

  enterClick(event) {
    this.search = (<HTMLInputElement>document.getElementById("search")).value;
    this.searchDropBox = (<HTMLInputElement>document.getElementById(
      "selected"
    )).value;
    sessionStorage.setItem("searchInput", JSON.stringify(this.search));
    sessionStorage.setItem("searchDropBox", JSON.stringify(this.searchDropBox));
    // console.log("session");
    // console.log(JSON.parse(sessionStorage.getItem('searchInput')))
    // console.log(JSON.parse(sessionStorage.getItem('searchDropBox')))
    this.router.navigateByUrl("/experts");
    window.location.reload();
  }
}
