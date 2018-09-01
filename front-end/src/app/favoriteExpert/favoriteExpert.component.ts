import { Component, OnInit } from "@angular/core";
import { FavoriteExpertService } from "./favoriteExpert.service";
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
  selector: "app-favexperts",
  templateUrl: "./favoriteExpert.component.html",
  styleUrls: ["./favoriteExpert.component.scss"],
  providers: [FavoriteExpertService]
})
export class FavoriteExpertComponent implements OnInit {
  favexperts = [];
  chosenExperts = [];
  message = "";
  searchVal: String;

  constructor(
    private favoriteExpertService: FavoriteExpertService,
    private router: Router,
    private as: AuthService
  ) {
    if (!this.as.authorized) this.router.navigateByUrl("/home");
  }
  add(name: string) {
    //  this.ls.updateListName(todo._id, todo.name).subscribe(console.log, console.error);

    this.favoriteExpertService.addFavoriteExpert(name).subscribe(
      (res: any) => {
        //console.log(res.data)
        alert(res.data.name);
        this.router.navigateByUrl("/favourites");
      },
      error => {
        window.alert(error.error.msg);
      }
    );
  }
  getProfile(expert) {
    sessionStorage.setItem("viewExpert", JSON.stringify(expert));
    this.router.navigateByUrl("/view-profile");
  }
  onClick() {
    var contactDiv = document.getElementById("done");
    scrollTo({ left: 0, top: contactDiv.offsetTop, behavior: "smooth" });
  }
  search() {
    this.searchVal = (<HTMLInputElement>document.getElementById(
      "searchTextField"
    )).value;
    sessionStorage.setItem("favInput", JSON.stringify(this.searchVal));
    window.location.reload();
  }

  remove(username) {
    this.favoriteExpertService.deleteFavoriteExpert(username).subscribe(
      (res: any) => {
        alert(username + " was deleted.");
        window.location.reload();
      },
      error => {
        window.alert(error.error.msg);
      }
    );
  }

  ngOnInit() {
    if (sessionStorage.getItem("favInput") == '""') {
      this.favoriteExpertService.getfavExperts().subscribe((res: any) => {
        if (res.hasOwnProperty("data")) {
          this.favexperts = res.data;
          for (var i = 0; i < this.favexperts.length; i++) {
            this.favexperts[i].view_id = i;
            this.favexperts[i].selected = false;
          }
        }
      });
    } else {
      this.favoriteExpertService
        .getfavExpertsByUsername(JSON.parse(sessionStorage.getItem("favInput")))
        .subscribe((res: any) => {
          if (res.hasOwnProperty("data")) {
            this.favexperts = res.data;
            for (var i = 0; i < this.favexperts.length; i++) {
              this.favexperts[i].view_id = i;
              this.favexperts[i].selected = false;
            }
            sessionStorage.setItem("favInput", '""');
            console.log("Successfully getfavExpertByUsername");
          }
        });
    }
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
