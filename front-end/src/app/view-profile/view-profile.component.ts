import { Component, OnInit } from "@angular/core";
import { ViewProfileService } from "./view-profile.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.scss"],
  providers: [ViewProfileService]
})
export class ViewProfileComponent {
  experiences = [];
  user = JSON.parse(sessionStorage.getItem("viewExpert"));
  visible = true;
  notes = [];

  constructor(
    private as: AuthService,
    private profileService: ViewProfileService
  ) {}

  ngOnInit() {
    this.profileService.getExperiences().subscribe((res: any) => {
      this.experiences = res.data;
    });
    this.viewNotes();
  }

  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  viewNotes() {
    this.profileService.viewNotes().subscribe((res: any) => {
      this.notes = res.data;
    });
  }
}
