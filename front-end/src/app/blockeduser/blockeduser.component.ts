import { Component, OnInit } from "@angular/core";
import { BlockedUserService } from "./blockeduser.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

@Component({
  selector: "app-blockeduser",
  templateUrl: "./blockeduser.component.html",
  styleUrls: ["./blockeduser.component.scss"],
  providers: [BlockedUserService]
})
export class BlockedUserComponent implements OnInit {
  blockedusers = [];
  message = "";

  constructor(
    private blockeduserService: BlockedUserService,
    private router: Router,
    private as: AuthService
  ) {
    if (!this.as.authorized) this.router.navigateByUrl("/home");
  }

  remove(user) {
    this.blockeduserService.unblockuser(user._id).subscribe(
      (res: any) => {
        alert(res.data.username + " was unblocked.");
        this.router.navigateByUrl("/profile");
      },
      error => {
        window.alert(error.error.msg);
      }
    );
  }

  ngOnInit() {
    this.blockeduserService.getblockedusers().subscribe((res: any) => {
      if (res.hasOwnProperty("data")) {
        this.blockedusers = res.data;
        for (var i = 0; i < this.blockedusers.length; i++) {
          this.blockedusers[i].view_id = i;
          this.blockedusers[i].selected = false;
        }
      }
    });
  }

  // ngOnInit() {
  // //  this.favoriteExpertService.getfavExperts().subscribe((res :any) => { console.log(res.data)});
  //
  //   this.favoriteExpertService.getfavExperts().subscribe(
  //     (res: any) => {
  //       //console.log(res.data)
  //       if (res.hasOwnProperty('data')) {
  //         console.log(res); console.log(res.data);
  //         this.favexperts = res.data;
  //         for (var i = 0; i < this.favexperts.length; i++) {
  //           this.favexperts[i].view_id = i;
  //           this.favexperts[i].selected = false;
  //         }
  //       }
  //     },
  //     (error) => {
  //     console.log(error);
  //     //let response = error.error as ResponseBody;
  //
  //     window.alert(error.error.msg);
  //   });
  //
  //
  //   console.log(this.favexperts);
  // // this.router.navigateByUrl("/profile");
  // }
}
