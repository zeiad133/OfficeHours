import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss']
})
export class Home2Component {



  visible = true;
  visible2 = false;


  vis() {
    this.visible = false;
    this.visible2 = true;

  }
  constructor() {

  }



  ngOnInit() {




  }


  signup(event) {
    window.location.href = "#/auth/signup"
  }

  signin(event) {
    window.location.href = "#/auth/signin"
  }

}
