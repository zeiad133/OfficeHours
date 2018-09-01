import { Component, OnInit } from "@angular/core";
import { WindowRef } from "../window.reference";
import { HostListener } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  originalSticky = 0;

  constructor(
    private winRef: WindowRef,
    private as: AuthService,
    private router: Router
  ) {
    if (this.as.authorized) {
      this.router.navigateByUrl("/profile");
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    // const verticalOffset = window.pageYOffset
    // || document.documentElement.scrollTop
    // || document.body.scrollTop || 0;
    var header = document.getElementById("myHeader");
    if (window.pageYOffset >= this.originalSticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  ngOnInit() {
    scrollTo({ left: 0, top: 0, behavior: "smooth" });
    var header = document.getElementById("myHeader");
    this.originalSticky = header.offsetTop;
    if (this.as.authorized) {
      window.location.reload();
      this.router.navigateByUrl("/profile");
    }
  }
  onClick() {
    var contactDiv = document.getElementById("services");
    scrollTo({ left: 0, top: contactDiv.offsetTop, behavior: "smooth" });
  }

  signup(event) {
    window.location.href = "#/auth/signup";
  }

  signin(event) {
    window.location.href = "#/auth/signin";
  }
}
