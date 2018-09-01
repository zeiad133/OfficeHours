import { Component } from "@angular/core";
import { regService } from "../app/services/reg.services";
import { WindowRef } from "./window.reference";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  template: `<headerr *ngIf="visible" style="background-color: #000000 "></headerr><router-outlet (activate)="onActivate($event)" style="z-index: 0"></router-outlet><footerr></footerr>`,

  providers: [regService, WindowRef]
})
export class AppComponent {
  visible = false;
  chosenExperts: any;
  registeredUser: any;
  filter = "admin";

  constructor(private as: AuthService, private router: Router) {
    if (this.as.authorized) {
      // this.getData();
      this.visible = true;
    } else this.visible = false;
  }
  ngDoCheck() {
    if (this.as.authorized) {
      this.visible = true;
    } else this.visible = false;
  }
  // Scroll up to the top of the page on changing the route
  onActivate(event) {}
  ngOnDestroy() {
    this.as.authorized = false;
  }
  getData() {
    this.as.getProfile().subscribe((res: any) => {
      this.registeredUser = res.data;
      sessionStorage.setItem("userType", res.data.type);
    });
  }
}
