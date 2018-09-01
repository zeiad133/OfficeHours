import { Component, OnInit } from "@angular/core";

@Component({
  selector: "footerr",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  constructor() {}
  scrollTop() {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth"
    });
  }
  ngOnInit() {}
}
